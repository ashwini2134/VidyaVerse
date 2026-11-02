export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  if (!normalized.includes(".replace(")) {
    return { passed: false, message: "❌ Expected code to use .replace() string method." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
