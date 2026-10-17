import { NextRequest, NextResponse } from 'next/server';
import { generateDeterministicExplanation } from '@/lib/scamEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      riskScore,
      riskLevel,
      indicators = [],
      model: customModel,
    } = body;

    // Helper to safely parse JSON from LLM text (handling markdown codeblocks or raw JSON)
    const extractJsonFromText = (rawText: string) => {
      const trimmed = rawText.trim();
      const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      const toParse = codeBlockMatch ? codeBlockMatch[1].trim() : trimmed;
      try {
        return JSON.parse(toParse);
      } catch {
        const objectMatch = toParse.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          return JSON.parse(objectMatch[0]);
        }
        throw new Error('Failed to parse structured JSON from local model output');
      }
    };

    const systemPrompt = `You are ScamShield AI, an elite cybersecurity and fraud intelligence agent running 100% locally.
Analyze the following user-submitted message or URL with calculated threat metrics:

Risk Score: ${riskScore}%
Calculated Threat Level: ${riskLevel}
Detected Heuristic Indicators:
${indicators.map((ind: { title: string; description: string }) => `- ${ind.title}: ${ind.description}`).join('\n') || '- None'}

Raw User Input:
"""
${text}
"""

TASK:
1. Explain in 2 crisp, authoritative sentences why this content is suspicious or what deceptive strategy it uses.
2. Identify the specific psychological trigger or trap exploited (e.g. Fear of Account Loss, Greed / Prize Euphoria, Impersonation of Legitimate Authority, Urgency Pressure).
3. Provide exactly 3 actionable, bulleted defensive steps the user must take right now to protect themselves.

FORMAT YOUR RESPONSE IN STRICT JSON:
{
  "summary": "2-sentence clear threat analysis...",
  "psychologicalTrigger": "Name & short description of the psychological manipulation...",
  "actionItems": [
    "Immediate action 1",
    "Immediate action 2",
    "Immediate action 3"
  ]
}`;

    // -----------------------------------------------------------------
    // 100% LOCAL INFERENCE: Local Ollama Server (http://localhost:11434)
    // -----------------------------------------------------------------
    try {
      const ollamaTagsRes = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(1500),
      });

      if (ollamaTagsRes.ok) {
        const tagsData = await ollamaTagsRes.json();
        const availableModels: string[] = (tagsData.models || []).map((m: { name: string }) => m.name);

        if (availableModels.length > 0) {
          const targetLocalModel =
            customModel && availableModels.some((m) => m.startsWith(customModel))
              ? customModel
              : availableModels.find((m) => m.includes('gemma')) ||
                availableModels[0];

          // Query local Ollama instance on device
          const ollamaChatRes = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: targetLocalModel,
              messages: [{ role: 'user', content: systemPrompt }],
              format: 'json',
              stream: false,
            }),
            signal: AbortSignal.timeout(20000),
          });

          if (ollamaChatRes.ok) {
            const chatData = await ollamaChatRes.json();
            const content = chatData?.message?.content;
            if (content) {
              const parsed = extractJsonFromText(content);
              return NextResponse.json({
                success: true,
                explanation: {
                  summary: parsed.summary || 'Content flagged as potentially deceptive.',
                  psychologicalTrigger:
                    parsed.psychologicalTrigger || 'Urgency & Authority exploitation',
                  actionItems: Array.isArray(parsed.actionItems)
                    ? parsed.actionItems
                    : [
                        'Do not click links or provide credentials.',
                        'Verify with the genuine organization via official contacts.',
                        'Report this incident to cybercrime authorities.',
                      ],
                  source: 'ollama_local',
                },
                modelUsed: `${targetLocalModel} (Local Ollama)`,
              });
            }
          }
        }
      }
    } catch {
      // Local Ollama instance not yet available or downloading; fall back to deterministic engine
    }

    // -----------------------------------------------------------------
    // 100% LOCAL FALLBACK: High-Accuracy Deterministic Heuristic Engine
    // -----------------------------------------------------------------
    const fallback = generateDeterministicExplanation(
      riskScore || 50,
      riskLevel || 'SUSPICIOUS',
      indicators
    );

    return NextResponse.json({
      success: true,
      explanation: fallback,
      source: 'deterministic_engine',
      notice: '100% Local Inference (Deterministic Heuristic Engine)',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Explanation endpoint error:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
