// ScamShield OSS Calibrated Heuristic Verification Suite
import { analyzeScamContent } from './src/lib/scamEngine.ts';

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`${BOLD}${CYAN}================================================================${RESET}`);
console.log(`${BOLD}${CYAN}🛡️  SCAMSHIELD OSS - CALIBRATED RISK SCORING VERIFICATION  🛡️${RESET}`);
console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

const testCases = [
  {
    name: 'User Hackathon Message: "Congratulations! You\'ve won ₹50,000. Click now."',
    type: 'message',
    input: "Congratulations! You've won ₹50,000. Click now.",
    expectedMin: 70,
    expectedMax: 89, // should be around 75-87%
  },
  {
    name: 'User Hackathon URL: "amazon-prize-2026.net"',
    type: 'url',
    input: "amazon-prize-2026.net",
    expectedMin: 72,
    expectedMax: 84, // should be around 78%
  },
  {
    name: 'Fake SBI KYC Urgent SMS',
    type: 'message',
    input: "Dear SBI User, your account will be suspended within 24 hours due to pending KYC. Click immediately: http://sbi-kyc-verify.xyz",
    expectedMin: 85,
    expectedMax: 96,
  },
  {
    name: 'Mild Urgency Single Word: "Please note this is urgent for our meeting"',
    type: 'message',
    input: "Please note this is urgent for our meeting tomorrow.",
    expectedMin: 22,
    expectedMax: 40,
  },
  {
    name: 'Telegram Work-From-Home Scam',
    type: 'message',
    input: "Part-time job offer! Earn ₹8,000 daily by liking YouTube videos. Deposit ₹1,500 security fee to start. Join t.me/fast_earn",
    expectedMin: 80,
    expectedMax: 92,
  },
  {
    name: 'Clean Legitimate Notification: GitHub Alert',
    type: 'message',
    input: "GitHub Security: A new personal access token was generated. Review your active sessions at https://github.com/settings/tokens",
    expectedMin: 2,
    expectedMax: 10,
  },
  {
    name: 'Clean Personal Message: Lunch Invitation',
    type: 'message',
    input: "Hey Neer, are we still meeting for lunch at 1pm tomorrow near the cafe?",
    expectedMin: 4,
    expectedMax: 12,
  },
  {
    name: 'Clean Corporate Email: Quarterly Report',
    type: 'message',
    input: "Dear Team, Please find attached the quarterly analytics report for your review. Regards, Neer",
    expectedMin: 3,
    expectedMax: 10,
  },
];

let allPassed = true;

testCases.forEach((tc, idx) => {
  console.log(`${BOLD}Test #${idx + 1}: ${tc.name}${RESET}`);
  console.log(`Input: "${tc.input}"`);

  const res = analyzeScamContent(tc.input, tc.type);

  console.log(`Calculated Score: ${BOLD}${res.riskScore}%${RESET} | Tier: ${res.riskLabel}`);
  console.log(`Detected Indicators (${res.indicators.length}):`);
  res.indicators.forEach((ind) => {
    console.log(`  ✓ [${ind.severity.toUpperCase()}] ${ind.title} (+${ind.impactPercent}%)`);
  });

  if (res.riskScore < tc.expectedMin || res.riskScore > tc.expectedMax) {
    console.log(`${RED}❌ FAILED: Score ${res.riskScore}% is outside expected range [${tc.expectedMin}% - ${tc.expectedMax}%]${RESET}`);
    allPassed = false;
  } else {
    console.log(`${GREEN}✅ PASSED (Within realistic target range ${tc.expectedMin}%-${tc.expectedMax}%)${RESET}`);
  }
  console.log('');
});

console.log(`${BOLD}${CYAN}----------------------------------------------------------------${RESET}`);
if (allPassed) {
  console.log(`${BOLD}${GREEN}🎉 ALL CALIBRATED RISK SCORING TESTS PASSED PERFECTLY!${RESET}`);
} else {
  console.log(`${BOLD}${RED}⚠️ SOME CALIBRATION TESTS FAILED!${RESET}`);
}
console.log(`${BOLD}${CYAN}----------------------------------------------------------------${RESET}\n`);
