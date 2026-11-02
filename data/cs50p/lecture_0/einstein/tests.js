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
  // Verify input() is used to read mass
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify int() conversion is used
  if (!normalized.includes("int(")) {
    return { passed: false, message: "❌ Expected code to convert the input to an int with int()." };
  }
  // Verify speed of light constant (300,000,000 m/s)
  if (!normalized.includes("300000000")) {
    return { passed: false, message: "❌ Expected code to use the speed of light, 300000000." };
  }
  // Verify multiplication for E = m * c * c calculation
  if (!normalized.includes("*")) {
    return { passed: false, message: "❌ Expected code to compute E = m * c² using multiplication." };
  }
  // Verify print() is used for output
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the result with print()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
