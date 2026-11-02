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
  if (!normalized.includes(".split(")) {
    return { passed: false, message: "❌ Expected code to split the date string." };
  }
  if (!normalized.includes("january") || !normalized.includes("december")) {
    return { passed: false, message: "❌ Expected a list of month names (January … December)." };
  }
  if (!normalized.includes(":02")) {
    return { passed: false, message: "❌ Expected zero-padded month/day (e.g. f\"{month:02}\")." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the date in YYYY-MM-DD format." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
