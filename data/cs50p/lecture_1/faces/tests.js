export function runTests(code) {
  const normalized = code.replace(/\s/g, "");
  if (!normalized.includes(".replace(")) {
    return { passed: false, message: "❌ Expected code to use .replace() string method." };
  }
  if (!normalized.includes("🙂") || !normalized.includes("🙁")) {
    return { passed: false, message: "❌ Expected code to output emoji faces 🙂 and 🙁." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
