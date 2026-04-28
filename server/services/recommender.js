function validateAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object") {
    return { valid: false, error: "Input must be a non-null object." };
  }

  const { loops, maxDepth, recursion } = analysis;

  if (typeof loops !== "number" || loops < 0) {
    return { valid: false, error: "'loops' must be a non-negative number." };
  }
  if (typeof maxDepth !== "number" || maxDepth < 0) {
    return { valid: false, error: "'maxDepth' must be a non-negative number." };
  }
  if (typeof recursion !== "boolean") {
    return { valid: false, error: "'recursion' must be a boolean." };
  }

  return { valid: true };
}

// ─────────────────────────────────────────────────────────────
// STEP 2 — Rule definitions
// ─────────────────────────────────────────────────────────────

const RULES = [
  // ── Rule 1 ───────────────────────────────────────────────
  // Three or more loops almost certainly means O(n³) or worse.
  // Warn loudly before giving finer-grained advice.
  {
    id:        "high-complexity-warning",
    priority:  1,
    condition: ({ loops }) => loops >= 3,
    message:
      "⚠️  High complexity detected (3+ loops). Your algorithm is likely " +
      "O(n³) or worse. Consider a fundamentally different approach: " +
      "sorting + binary search, prefix sums, or a greedy strategy.",
  },

  // ── Rule 2 ───────────────────────────────────────────────
  // Nested loops (maxDepth ≥ 2) are the most common source of
  // avoidable O(n²) complexity. Offer concrete alternatives.
  {
    id:        "nested-loops",
    priority:  2,
    condition: ({ maxDepth }) => maxDepth >= 2,
    message:
      "🔁  Nested loops detected (depth ≥ 2). This usually means O(n²) " +
      "time. Consider: HashMap/HashSet for O(1) lookups, a two-pointer " +
      "technique on a sorted array, or a sliding-window approach.",
  },

  // ── Rule 3 ───────────────────────────────────────────────
  // Recursion alone is fine, but if it re-computes sub-problems
  // (which pattern-matching can't always tell) it can be expensive.
  // Suggest memoization / DP as a safe default.
  {
    id:        "recursion-optimisation",
    priority:  3,
    condition: ({ recursion }) => recursion === true,
    message:
      "♻️  Recursive call detected. If the function solves overlapping " +
      "sub-problems (e.g. Fibonacci, knapsack), add memoization or " +
      "rewrite as bottom-up dynamic programming to avoid redundant work.",
  },

  // ── Rule 4 ───────────────────────────────────────────────
  // Recursion AND loops together can compound complexity quickly.
  // Flag the combination explicitly.
  {
    id:        "recursion-with-loops",
    priority:  4,
    condition: ({ loops, recursion }) => recursion === true && loops >= 1,
    message:
      "🔗  Recursion combined with loops can multiply time complexity " +
      "significantly. Profile carefully and consider iterative DP or " +
      "tail-recursion where your runtime supports it.",
  },

  // ── Rule 5 ───────────────────────────────────────────────
  // A single, non-nested loop is O(n) — already good.
  // Acknowledge it but mention minor wins still available.
  {
    id:        "single-loop-ok",
    priority:  5,
    condition: ({ loops, maxDepth }) => loops === 1 && maxDepth === 1,
    message:
      "✅  A single linear loop looks good — likely O(n). Minor wins: " +
      "move invariant computations outside the loop, avoid redundant " +
      "conditional checks inside it, and prefer early-exit (break) " +
      "when possible.",
  },

  // ── Rule 6 ───────────────────────────────────────────────
  // Multiple loops at depth 1 (sequential, not nested) is still
  // O(n) overall, but a single pass is cleaner and cache-friendlier.
  {
    id:        "multiple-sequential-loops",
    priority:  6,
    condition: ({ loops, maxDepth }) => loops >= 2 && maxDepth === 1,
    message:
      "🔄  Multiple sequential loops found (none nested). Overall " +
      "complexity is still O(n), but merging them into a single pass " +
      "reduces constant factors and improves cache locality.",
  },

  // ── Rule 7 ───────────────────────────────────────────────
  // No loops and no recursion → constant or direct computation.
  // This is the best possible outcome; confirm it.
  {
    id:        "already-optimal",
    priority:  7,
    condition: ({ loops, recursion }) => loops === 0 && recursion === false,
    message:
      "🚀  No loops or recursion detected. The function appears to run " +
      "in O(1) time — that's optimal! Just ensure correctness and " +
      "keep it readable.",
  },
];

// ─────────────────────────────────────────────────────────────
// STEP 3 — Rule engine
// ─────────────────────────────────────────────────────────────

function applyRules(analysis) {
  const suggestions = [];
  const seen        = new Set();

  // Sort rules by priority (lowest number = first)
  const sorted = [...RULES].sort((a, b) => a.priority - b.priority);

  for (const rule of sorted) {
    if (seen.has(rule.id)) continue;          // deduplicate
    if (rule.condition(analysis)) {
      suggestions.push(rule.message);
      seen.add(rule.id);
    }
  }

  return suggestions;
}

// ─────────────────────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────────────────────

function getSuggestions(analysis) {
  // Validate first — return a single error string in an array
  // so callers always get an array back (consistent contract).
  const { valid, error } = validateAnalysis(analysis);
  if (!valid) {
    return [`❌  Invalid input: ${error}`];
  }

  const suggestions = applyRules(analysis);

  // Fallback: no rules matched (shouldn't happen with current set,
  // but defensive for future rule changes).
  if (suggestions.length === 0) {
    return ["ℹ️  No specific suggestions for this pattern. Review manually."];
  }

  return suggestions;
}

// ─────────────────────────────────────────────────────────────
// SELF-TEST
// ─────────────────────────────────────────────────────────────

const testCases = [
  {
    label:    "Already optimal (no loops, no recursion)",
    input:    { loops: 0, maxDepth: 0, recursion: false },
    mustInclude: ["already-optimal"],
  },
  {
    label:    "Single linear loop",
    input:    { loops: 1, maxDepth: 1, recursion: false },
    mustInclude: ["single-loop-ok"],
  },
  {
    label:    "Nested loops (O(n²))",
    input:    { loops: 2, maxDepth: 2, recursion: false },
    mustInclude: ["nested-loops"],
  },
  {
    label:    "Pure recursion",
    input:    { loops: 0, maxDepth: 0, recursion: true },
    mustInclude: ["recursion-optimisation"],
  },
  {
    label:    "Three loops — high complexity",
    input:    { loops: 3, maxDepth: 3, recursion: false },
    mustInclude: ["high-complexity-warning", "nested-loops"],
  },
  {
    label:    "Recursion + loop combo",
    input:    { loops: 1, maxDepth: 1, recursion: true },
    mustInclude: ["recursion-optimisation", "recursion-with-loops", "single-loop-ok"],
  },
  {
    label:    "Multiple sequential loops (depth 1)",
    input:    { loops: 2, maxDepth: 1, recursion: false },
    mustInclude: ["multiple-sequential-loops"],
  },
  // ── Edge cases ────────────────────────────────────────────
  {
    label:    "Edge: null input",
    input:    null,
    mustInclude: [],   // just check it doesn't throw
    expectError: true,
  },
  {
    label:    "Edge: missing recursion field",
    input:    { loops: 1, maxDepth: 1 },
    mustInclude: [],
    expectError: true,
  },
  {
    label:    "Edge: negative loops",
    input:    { loops: -1, maxDepth: 0, recursion: false },
    mustInclude: [],
    expectError: true,
  },
];

// Map rule ID → message prefix (first 10 chars) for assertion lookup
const ruleMessageMap = Object.fromEntries(RULES.map(r => [r.id, r.message]));

console.log("=".repeat(60));
console.log("  Recommendation Engine — Self-Test");
console.log("=".repeat(60));

let passed = 0;
for (const tc of testCases) {
  const results = getSuggestions(tc.input);

  let ok = true;
  let failReason = "";

  if (tc.expectError) {
    // Should return exactly one error message starting with ❌
    if (!results[0].startsWith("❌")) {
      ok = false;
      failReason = `Expected an error message, got: ${results[0]}`;
    }
  } else {
    // Every required rule ID should have its message in results
    for (const ruleId of tc.mustInclude) {
      const expected = ruleMessageMap[ruleId];
      if (!results.includes(expected)) {
        ok = false;
        failReason = `Missing suggestion for rule "${ruleId}"`;
        break;
      }
    }
  }

  console.log(`\n[${ok ? "PASS ✓" : "FAIL ✗"}] ${tc.label}`);
  console.log("  Input    :", JSON.stringify(tc.input));
  results.forEach(s => console.log("  →", s));
  if (!ok) console.log("  !! FAIL REASON:", failReason);
  if (ok) passed++;
}

console.log("\n" + "=".repeat(60));
console.log(`  Results: ${passed} / ${testCases.length} tests passed`);
console.log("=".repeat(60));

// ─────────────────────────────────────────────────────────────
// MODULE EXPORT
// ─────────────────────────────────────────────────────────────
module.exports = { getSuggestions, validateAnalysis, RULES };