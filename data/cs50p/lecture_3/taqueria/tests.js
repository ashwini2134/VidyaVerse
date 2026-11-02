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
  if (!normalized.includes("total:")) {
    return { passed: false, message: "❌ Expected code to print 'Total: $...'." };
  }
  if (!normalized.includes(".2f")) {
    return { passed: false, message: "❌ Expected the total formatted to two decimal places (.2f)." };
  }
  if (!normalized.includes("bajataco") && !normalized.includes("burrito")) {
    return { passed: false, message: "❌ Expected the menu (e.g. 'Baja Taco', 'Burrito') in your code." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
