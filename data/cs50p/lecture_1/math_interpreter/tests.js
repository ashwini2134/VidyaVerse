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
  // Verify input() is used to read expression
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify .split() is used to parse operators
  if (!normalized.includes(".split(")) {
    return { passed: false, message: "❌ Expected code to split the expression with .split()." };
  }
  // Verify int() conversion for operands
  if (!normalized.includes("int(")) {
    return { passed: false, message: "❌ Expected code to convert operands with int()." };
  }
  // Verify decimal formatting to 1 place
  if (!normalized.includes(".1f")) {
    return { passed: false, message: "❌ Expected output formatted to one decimal place (e.g. f\"{result:.1f}\")." };
  }
  // Verify print() for output
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the result with print()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
