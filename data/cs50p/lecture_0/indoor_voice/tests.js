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
  // Verify input() is present in actual code (not just comments/strings)
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify .lower() method is present for case conversion
  if (!normalized.includes(".lower(")) {
    return { passed: false, message: "❌ Expected code to convert the input to lowercase with .lower()." };
  }
  // Verify print() is used for output
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the result with print()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
