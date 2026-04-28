function extractFunctionName(code) {
  // Keywords that can appear before '(' but are NOT function names
  const javaKeywords = new Set([
    "if", "else", "for", "while", "do", "switch",
    "catch", "return", "new", "super", "this"
  ]);

  // Match every word followed by '(' — pick the first non-keyword one
  const pattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    const candidate = match[1];
    if (!javaKeywords.has(candidate)) {
      return candidate;
    }
  }

  return null;  // no recognisable function name found
}

// ─────────────────────────────────────────────────────────────
// STEP 2 — Count loops and compute maximum nesting depth
// ─────────────────────────────────────────────────────────────

function analyzeLoops(lines) {
  // Matches 'for' or 'while' as a whole word (not inside identifiers)
  const loopPattern = /\b(for|while)\b/;

  let loopCount = 0;   // total loops seen
  let maxDepth  = 0;   // deepest loop nesting recorded
  let depth     = 0;   // current brace depth as we scan top-to-bottom

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip blank lines and single-line comments
    if (!line || line.startsWith("//")) continue;

    // Count braces on this line
    const opens  = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;

    // Apply closing braces FIRST (we are leaving those blocks)
    depth -= closes;
    if (depth < 0) depth = 0;  // guard against malformed snippets

    // Apply opening braces (we are entering those blocks)
    depth += opens;

    // If this line contains a loop keyword, record it.
    // We record AFTER processing braces on this line so that a
    // header like "for (...) {" already reflects the new depth.
    // We subtract 1 to exclude the function body's own outer brace,
    // so a single top-level loop correctly reports depth = 1.
    if (loopPattern.test(line)) {
      loopCount++;
      const loopDepth = Math.max(0, depth - 1);
      if (loopDepth > maxDepth) {
        maxDepth = loopDepth;
      }
    }
  }

  return { loops: loopCount, maxDepth };
}

// ─────────────────────────────────────────────────────────────
// STEP 3 — Detect recursion
// ─────────────────────────────────────────────────────────────

function detectRecursion(lines, functionName) {
  if (!functionName) return false;  // can't detect without a name

  const fullCode = lines.join("\n");

  // Build a whole-word regex for the function name
  const namePattern = new RegExp(`\\b${functionName}\\b`, "g");
  const matches = fullCode.match(namePattern) || [];

  // First occurrence = the declaration; second+ = a call = recursion
  return matches.length >= 2;
}

// ─────────────────────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────────────────────

function analyzeCode(code) {
  if (typeof code !== "string" || !code.trim()) {
    // Return safe defaults for empty / invalid input
    return { loops: 0, maxDepth: 0, recursion: false };
  }

  // Split into lines (handles both \n and \r\n line endings)
  const lines = code.split(/\r?\n/);

  // Run each analysis module
  const functionName           = extractFunctionName(code);
  const { loops, maxDepth }    = analyzeLoops(lines);
  const recursion              = detectRecursion(lines, functionName);

  return { loops, maxDepth, recursion };
}

// ─────────────────────────────────────────────────────────────
// QUICK SELF-TEST  (remove or comment out in production)
// ─────────────────────────────────────────────────────────────

const testCases = [
  {
    label: "Simple single loop",
    code: `
      public int sumArray(int[] arr) {
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
          sum += arr[i];
        }
        return sum;
      }
    `,
    expected: { loops: 1, maxDepth: 1, recursion: false }
  },
  {
    label: "Nested loops",
    code: `
      public void printMatrix(int[][] m) {
        for (int i = 0; i < m.length; i++) {
          for (int j = 0; j < m[i].length; j++) {
            System.out.print(m[i][j]);
          }
        }
      }
    `,
    expected: { loops: 2, maxDepth: 2, recursion: false }
  },
  {
    label: "Recursive function",
    code: `
      public int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
    `,
    expected: { loops: 0, maxDepth: 0, recursion: true }
  },
  {
    label: "Recursive + loop",
    code: `
      public int factorial(int n) {
        if (n == 0) return 1;
        int result = 1;
        while (n > 0) {
          result *= n--;
        }
        return factorial(n);   // intentional (though wrong) recursion
      }
    `,
    expected: { loops: 1, maxDepth: 1, recursion: true }
  },
  {
    label: "Triple-nested loops",
    code: `
      public void tripleLoop(int n) {
        for (int i = 0; i < n; i++) {
          for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
              System.out.println(i + j + k);
            }
          }
        }
      }
    `,
    expected: { loops: 3, maxDepth: 3, recursion: false }
  }
];

console.log("=".repeat(55));
console.log("  Algorithm Analyzer — Self-Test");
console.log("=".repeat(55));

let passed = 0;
for (const tc of testCases) {
  const result = analyzeCode(tc.code);
  const ok =
    result.loops     === tc.expected.loops     &&
    result.maxDepth  === tc.expected.maxDepth  &&
    result.recursion === tc.expected.recursion;

  console.log(`\n[${ok ? "PASS ✓" : "FAIL ✗"}] ${tc.label}`);
  console.log(`  Expected : ${JSON.stringify(tc.expected)}`);
  console.log(`  Got      : ${JSON.stringify(result)}`);
  if (ok) passed++;
}

console.log("\n" + "=".repeat(55));
console.log(`  Results: ${passed} / ${testCases.length} tests passed`);
console.log("=".repeat(55));

module.exports = { analyzeCode, extractFunctionName, analyzeLoops, detectRecursion };