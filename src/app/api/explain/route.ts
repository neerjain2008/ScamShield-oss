import { NextRequest, NextResponse } from 'next/server';
import { generateDeterministicExplanation, AnalysisResult } from '@/lib/scamEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      riskScore,
      riskLevel,
      indicators = [],
      apiKey: customApiKey,
      provider = 'gemma', // 'gemma' | 'digitalocean' | 'openai'
      baseUrl: customBaseUrl,
      model: customModel,
    } = body;

    const apiKey =
      customApiKey ||
      process.env.GEMMA_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.DIGITALOCEAN_GENAI_KEY;

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
        throw new Error('Failed to parse structured JSON from AI output');
      }
    };

    // If no API key is provided, return our deterministic high-quality engine explanation immediately
    if (!apiKey) {
      const fallback = generateDeterministicExplanation(
        riskScore || 50,
        riskLevel || 'SUSPICIOUS',
        indicators,
        text || ''
      );
      return NextResponse.json({
        success: true,
        explanation: fallback,
        source: 'deterministic_engine',
        notice: 'Using deterministic intelligence engine (Provide a Google AI Studio API key for Gemma 4 synthesis).',
      });
    }

    const systemPrompt = `You are ScamShield AI, an elite cybersecurity and fraud intelligence agent powered by Google Gemma 4.
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

    // Path A: DigitalOcean GenAI / Hermes / OpenAI-compatible endpoint
    if (provider === 'digitalocean' || customBaseUrl) {
      const endpoint = customBaseUrl || 'https://api.digitalocean.com/v2/genai/chat/completions';
      const model = customModel || 'hermes-3-llama-3.1-8b';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: systemPrompt }],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const contentStr = data?.choices?.[0]?.message?.content;
        if (contentStr) {
          const parsed = extractJsonFromText(contentStr);
          return NextResponse.json({
            success: true,
            explanation: {
              summary: parsed.summary || 'Content flagged as potentially deceptive.',
              psychologicalTrigger: parsed.psychologicalTrigger || 'Urgency & Authority exploitation',
              actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [
                'Do not click links or provide credentials.',
                'Verify with the genuine organization via official contacts.',
                'Report this incident to cybercrime authorities.',
              ],
              source: 'digitalocean',
            },
          });
        }
      }
    }

    // Path B: Google Gemma 4 (Google AI Studio Hosted Endpoint)
    // Priority order: gemma-4-31b-it -> gemma-4-26b-a4b-it -> fallback
    const targetModels = customModel
      ? [customModel]
      : ['gemma-4-31b-it', 'gemma-4-26b-a4b-it', 'gemini-1.5-flash'];

    let aiRes: Response | null = null;
    let selectedModel = 'gemma-4-31b-it';

    for (const modelCandidate of targetModels) {
      const gemmaUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${apiKey}`;
      try {
        const res = await fetch(gemmaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 700,
            },
          }),
        });

        if (res.ok) {
          aiRes = res;
          selectedModel = modelCandidate;
          break;
        } else {
          console.warn(`Model ${modelCandidate} returned HTTP ${res.status}, attempting next candidate...`);
        }
      } catch (err) {
        console.warn(`Failed calling ${modelCandidate}:`, err);
      }
    }

    if (!aiRes || !aiRes.ok) {
      console.warn('Gemma 4 API call failed, falling back to deterministic engine');
      const fallback = generateDeterministicExplanation(
        riskScore || 50,
        riskLevel || 'SUSPICIOUS',
        indicators,
        text || ''
      );
      return NextResponse.json({
        success: true,
        explanation: fallback,
        source: 'engine',
      });
    }

    const aiData = await aiRes.json();
    const rawContent = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      throw new Error('Empty response from Gemma 4 service');
    }

    // Parse structured JSON response
    const parsed = extractJsonFromText(rawContent);

    return NextResponse.json({
      success: true,
      explanation: {
        summary: parsed.summary || 'Content flagged as potentially deceptive.',
        psychologicalTrigger: parsed.psychologicalTrigger || 'Urgency & Authority exploitation',
        actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [
          'Do not click links or provide credentials.',
          'Verify with the genuine organization via official contacts.',
          'Report this incident to cybercrime authorities.',
        ],
        source: 'gemma',
      },
      modelUsed: selectedModel,
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
