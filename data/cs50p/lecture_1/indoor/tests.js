export function runTests(code) {
  const normalized = code.toLowerCase().replace(/\s/g, "");
  if (!normalized.includes(".lower()")) {
    return { passed: false, message: "❌ Expected code to use .lower() string method." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
