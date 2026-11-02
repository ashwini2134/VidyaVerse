export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  if (!normalized.includes("eoferror")) {
    return { passed: false, message: "❌ Expected code to catch EOFError (control-d)." };
  }
  if (!normalized.includes(".upper(")) {
    return { passed: false, message: "❌ Expected items to be uppercased with .upper()." };
  }
  if (!normalized.includes("sorted(")) {
    return { passed: false, message: "❌ Expected the list to be sorted alphabetically with sorted()." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print each item with its count." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
