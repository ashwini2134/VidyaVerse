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
  // Verify input() is present for reading user input
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify .replace() method is used
  if (!normalized.includes(".replace(")) {
    return { passed: false, message: "❌ Expected code to use the .replace() string method." };
  }
  // Verify "..." is the replacement string (not in comment)
  if (!normalized.includes("...")) {
    return { passed: false, message: "❌ Expected code to insert '...' between words." };
  }
  // Verify print() is used for output
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the result with print()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
