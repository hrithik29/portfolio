#!/usr/bin/env node

/**
 * Portfolio Bot Eval Framework
 * 
 * Runs 20 test cases against your portfolio's /api/chat endpoint.
 * Each answer is judged by Claude on two dimensions:
 *   - accuracy:    does it match ground truth facts?
 *   - positioning: does it sound like a strong, interview-ready PM?
 * 
 * Usage:
 *   node eval.js                          # runs against production
 *   node eval.js --url http://localhost:3000  # runs against local dev
 *   node eval.js --category metrics       # runs only one category
 *   node eval.js --id TC01               # runs a single test case
 */

const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const DEFAULT_PORTFOLIO_URL = "https://hrithik-jain.vercel.app";
const TEST_CASES_PATH = path.join(__dirname, "test-cases.json");
const RESULTS_DIR = path.join(__dirname, "results");

// ─── CLI ARGS ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const PORTFOLIO_URL = getArg("--url") || DEFAULT_PORTFOLIO_URL;
const FILTER_CATEGORY = getArg("--category");
const FILTER_ID = getArg("--id");

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function log(msg, type = "info") {
  const prefix = { info: "  ", pass: "✅", fail: "❌", warn: "⚠️ ", header: "\n🔍" };
  console.log(`${prefix[type] || "  "} ${msg}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── STEP 1: CALL YOUR PORTFOLIO BOT ─────────────────────────────────────────

async function askPortfolioBot(question) {
  const url = `${PORTFOLIO_URL}/api/chat`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question }), // matches route.ts: { message }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return data.reply || JSON.stringify(data); // matches route.ts: { reply }
  } catch (err) {
    return `ERROR: ${err.message}`;
  }
}

// ─── STEP 2: JUDGE THE ANSWER ─────────────────────────────────────────────────

async function judgeAnswer(testCase, botAnswer) {
  const judgePrompt = `You are evaluating an AI portfolio bot that represents Hrithik Jain, a Product Manager with ~4 years of experience.

A recruiter asked the bot a question. You must score the bot's answer on two dimensions.

---
QUESTION ASKED:
${testCase.question}

---
GROUND TRUTH (what the answer should contain):
Key facts that should be present:
${testCase.ground_truth.key_facts.map((f) => `- ${f}`).join("\n")}

${
  testCase.ground_truth.must_not_say?.length
    ? `Things the answer must NOT say or imply:\n${testCase.ground_truth.must_not_say.map((f) => `- ${f}`).join("\n")}`
    : ""
}

---
EVAL CRITERIA:
Accuracy: ${testCase.eval_criteria.accuracy}
Positioning: ${testCase.eval_criteria.positioning}

---
BOT'S ACTUAL ANSWER:
${botAnswer}

---
SCORING INSTRUCTIONS:

Score ACCURACY (0-10):
- 9-10: All key facts present, nothing from must_not_say, no hallucinations
- 7-8: Most key facts present, minor omissions, no hallucinations
- 5-6: Some key facts present but notable gaps or one hallucination
- 3-4: Key facts mostly missing or significant hallucination
- 0-2: Wrong facts, made-up numbers, or says something from must_not_say

Score POSITIONING (0-10):
- 9-10: Leads with metrics, specific and confident, sounds like a strong PM candidate, no filler
- 7-8: Good but slightly generic or missing a key proof point
- 5-6: Adequate but vague or too long without substance
- 3-4: Generic, no metrics, or feels like a resume read-out
- 0-2: Weak, vague, hallucinates a personality, or is off-brand

For each failing dimension (score < 7), write one specific, actionable reason why.

Respond ONLY with valid JSON in this exact format:
{
  "accuracy_score": <0-10>,
  "positioning_score": <0-10>,
  "accuracy_pass": <true if score >= 7, else false>,
  "positioning_pass": <true if score >= 7, else false>,
  "accuracy_reason": "<one sentence — what was right or what was wrong>",
  "positioning_reason": "<one sentence — what was strong or what was weak>",
  "hallucination_detected": <true or false>,
  "hallucination_detail": "<if true, what was hallucinated — else null>"
}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a strict evaluator. Respond only with valid JSON." },
          { role: "user", content: judgePrompt },
        ],
        temperature: 0,
        max_tokens: 500,
      }),
    });

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "{}";

    // Strip markdown fences if present
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    return {
      accuracy_score: 0,
      positioning_score: 0,
      accuracy_pass: false,
      positioning_pass: false,
      accuracy_reason: `Judge error: ${err.message}`,
      positioning_reason: "Could not evaluate",
      hallucination_detected: false,
      hallucination_detail: null,
    };
  }
}

// ─── STEP 3: RUN ALL TESTS ────────────────────────────────────────────────────

async function runEval() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Portfolio Bot Eval Framework");
  console.log(`  Target: ${PORTFOLIO_URL}`);
  if (FILTER_CATEGORY) console.log(`  Filter: category = ${FILTER_CATEGORY}`);
  if (FILTER_ID) console.log(`  Filter: id = ${FILTER_ID}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const allCases = JSON.parse(fs.readFileSync(TEST_CASES_PATH, "utf8"));

  let testCases = allCases;
  if (FILTER_CATEGORY) testCases = testCases.filter((t) => t.category === FILTER_CATEGORY);
  if (FILTER_ID) testCases = testCases.filter((t) => t.id === FILTER_ID);

  if (testCases.length === 0) {
    console.log("No test cases matched your filter.");
    process.exit(1);
  }

  const results = [];
  let passed = 0;
  let failed = 0;
  let hallucinations = 0;

  for (const tc of testCases) {
    log(`[${tc.id}] ${tc.category.toUpperCase()} — ${tc.question}`, "header");

    // 1. Ask the bot
    log("Asking portfolio bot...");
    const botAnswer = await askPortfolioBot(tc.question);

    if (botAnswer.startsWith("ERROR:")) {
      log(`Bot request failed: ${botAnswer}`, "fail");
      results.push({
        ...tc,
        bot_answer: botAnswer,
        scores: null,
        overall_pass: false,
        error: botAnswer,
      });
      failed++;
      continue;
    }

    log(`Bot answered (${botAnswer.length} chars)`);

    // 2. Judge the answer
    log("Judging answer...");
    const scores = await judgeAnswer(tc, botAnswer);

    const overallPass = scores.accuracy_pass && scores.positioning_pass;
    if (overallPass) {
      passed++;
      log(`PASS  — Accuracy: ${scores.accuracy_score}/10 | Positioning: ${scores.positioning_score}/10`, "pass");
    } else {
      failed++;
      log(`FAIL  — Accuracy: ${scores.accuracy_score}/10 | Positioning: ${scores.positioning_score}/10`, "fail");
      if (!scores.accuracy_pass) log(`  Accuracy issue: ${scores.accuracy_reason}`, "warn");
      if (!scores.positioning_pass) log(`  Positioning issue: ${scores.positioning_reason}`, "warn");
    }

    if (scores.hallucination_detected) {
      hallucinations++;
      log(`HALLUCINATION: ${scores.hallucination_detail}`, "fail");
    }

    results.push({
      id: tc.id,
      category: tc.category,
      question: tc.question,
      bot_answer: botAnswer,
      ground_truth: tc.ground_truth,
      scores,
      overall_pass: overallPass,
    });

    // Avoid rate limiting
    await sleep(500);
  }

  // ─── SUMMARY ───────────────────────────────────────────────────────────────

  const total = results.length;
  const passRate = Math.round((passed / total) * 100);

  const avgAccuracy = (
    results
      .filter((r) => r.scores)
      .reduce((sum, r) => sum + r.scores.accuracy_score, 0) /
    results.filter((r) => r.scores).length
  ).toFixed(1);

  const avgPositioning = (
    results
      .filter((r) => r.scores)
      .reduce((sum, r) => sum + r.scores.positioning_score, 0) /
    results.filter((r) => r.scores).length
  ).toFixed(1);

  const byCategory = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = { pass: 0, total: 0 };
    byCategory[r.category].total++;
    if (r.overall_pass) byCategory[r.category].pass++;
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  EVAL SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Total:          ${total} tests`);
  console.log(`  Passed:         ${passed} (${passRate}%)`);
  console.log(`  Failed:         ${failed}`);
  console.log(`  Hallucinations: ${hallucinations}`);
  console.log(`  Avg Accuracy:   ${avgAccuracy}/10`);
  console.log(`  Avg Positioning:${avgPositioning}/10`);
  console.log("\n  By Category:");
  for (const [cat, stat] of Object.entries(byCategory)) {
    const rate = Math.round((stat.pass / stat.total) * 100);
    const icon = rate === 100 ? "✅" : rate >= 70 ? "⚠️ " : "❌";
    console.log(`  ${icon} ${cat.padEnd(15)} ${stat.pass}/${stat.total} (${rate}%)`);
  }

  const failures = results.filter((r) => !r.overall_pass);
  if (failures.length > 0) {
    console.log("\n  Failed Tests:");
    for (const f of failures) {
      console.log(`  ❌ [${f.id}] ${f.question}`);
    }
  }

  // ─── SAVE REPORT ───────────────────────────────────────────────────────────

  if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const reportPath = path.join(RESULTS_DIR, `eval-${timestamp}.json`);

  const report = {
    meta: {
      timestamp: new Date().toISOString(),
      portfolio_url: PORTFOLIO_URL,
      total_tests: total,
      passed,
      failed,
      pass_rate_pct: passRate,
      hallucinations_detected: hallucinations,
      avg_accuracy_score: parseFloat(avgAccuracy),
      avg_positioning_score: parseFloat(avgPositioning),
      by_category: byCategory,
    },
    results,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n  📄 Full report saved: ${reportPath}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(failed > 0 ? 1 : 0);
}

runEval().catch((err) => {
  console.error("Eval crashed:", err);
  process.exit(1);
});
