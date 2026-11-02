export function runTests(code) {
  // Reject TODO/FIXME/placeholder code
  if (/\b(TODO|FIXME|HACK|XXX|PLACEHOLDER)\b/i.test(code)) {
    return { passed: false, message: "❌ Code contains incomplete TODO/FIXME markers." };
  }

  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  // Verify re import
  if (!normalized.includes("importre") && !normalized.includes("fromreimport")) {
    return { passed: false, message: "❌ Expected code to import the re module." };
  }
  // Verify count function exists
  if (!normalized.includes("defcount(")) {
    return { passed: false, message: "❌ Expected a count() function." };
  }
  // Verify regex method usage
  if (!normalized.includes("findall(") && !normalized.includes("re.search(")) {
    return { passed: false, message: "❌ Expected code to use re.findall() (or re.search())." };
  }
  // Verify word boundary pattern for 'um'
  if (!normalized.includes("\\bum\\b") && !normalized.includes("r'\\bum\\b'") && !normalized.includes("r\"\\bum\\b\"")) {
    return { passed: false, message: "❌ Expected a word-boundary pattern for 'um' (e.g. r\"\\bum\\b\")." };
  }
  // Verify case insensitivity matching
  if (!normalized.includes("ignorecase")) {
    return { passed: false, message: "❌ Expected the match to be case-insensitive (re.IGNORECASE)." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
