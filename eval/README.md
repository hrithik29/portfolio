# Portfolio Bot Eval Framework

Evaluates your AI portfolio bot on **accuracy** (does it get the facts right?) and **positioning** (does it sound like a strong PM candidate?).

---

## Setup

```bash
cd eval/
npm install
```

Set your Anthropic API key (used to run the judge LLM):
```bash
export ANTHROPIC_API_KEY=your_key_here
```

---

## Running

```bash
# Full eval against production
node eval.js

# Against local dev server
node eval.js --url http://localhost:3000

# One category only
node eval.js --category metrics
node eval.js --category projects
node eval.js --category experience
node eval.js --category behavioural
node eval.js --category edge_cases

# Single test case
node eval.js --id TC01
```

---

## Test Cases (20 total)

| Category | Count | What it tests |
|----------|-------|---------------|
| `metrics` | 5 | Exact numbers — retention lift, conversion, CSAT, cost savings |
| `projects` | 4 | Project narratives — discovery, decisions, conflict resolution |
| `experience` | 3 | Role details, availability, scope of ownership |
| `behavioural` | 5 | Superpower, why leave, data approach, eng collaboration, AI usage |
| `edge_cases` | 3 | Failure question, salary, coding ability |

---

## Scoring

Each answer is scored by Claude on two dimensions:

| Dimension | Pass threshold | What it checks |
|-----------|---------------|----------------|
| **Accuracy** | ≥ 7/10 | Key facts present, no hallucinations, nothing from must_not_say list |
| **Positioning** | ≥ 7/10 | Leads with metrics, specific proof points, sounds like a strong PM |

A test **passes** only if both dimensions score ≥ 7.

---

## Output

Terminal output shows pass/fail per test with specific failure reasons.

Full JSON report saved to `results/eval-<timestamp>.json`:

```json
{
  "meta": {
    "total_tests": 20,
    "passed": 17,
    "failed": 3,
    "pass_rate_pct": 85,
    "hallucinations_detected": 0,
    "avg_accuracy_score": 8.4,
    "avg_positioning_score": 7.9,
    "by_category": { ... }
  },
  "results": [
    {
      "id": "TC01",
      "category": "metrics",
      "question": "...",
      "bot_answer": "...",
      "scores": {
        "accuracy_score": 9,
        "positioning_score": 8,
        "accuracy_pass": true,
        "positioning_pass": true,
        "accuracy_reason": "...",
        "positioning_reason": "...",
        "hallucination_detected": false,
        "hallucination_detail": null
      },
      "overall_pass": true
    }
  ]
}
```

---

## Most Critical Test Cases

These are the ones most likely to catch real problems:

- **TC01** — Rewards retention: must say 8% (isolated), must NOT say 22% caused by rewards
- **TC07** — Support conflict: must describe the risk-profiling resolution, not just "we automated it"
- **TC11** — Availability: must confirm immediate joiner, must NOT say currently at NewMe
- **TC17** — Failure question: must NOT hallucinate a failure story

---

## Adding New Test Cases

Edit `test-cases.json` and add an object following this schema:

```json
{
  "id": "TC21",
  "category": "metrics",
  "question": "Your question here",
  "ground_truth": {
    "key_facts": ["fact 1", "fact 2"],
    "must_not_say": ["wrong thing 1"]
  },
  "eval_criteria": {
    "accuracy": "What the accuracy judge should check for",
    "positioning": "What the positioning judge should check for"
  }
}
```

---

## When to Run

- After updating any `data/*.json` file
- After changing the system prompt in `ai/`
- Before sharing the portfolio URL with a recruiter
