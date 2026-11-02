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
  // Verify while loop for coin input
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected code to use a while loop to keep prompting for coins." };
  }
  // Verify amount due display
  if (!normalized.includes("amountdue:")) {
    return { passed: false, message: "❌ Expected code to print 'Amount Due:' each time." };
  }
  // Verify coin input prompt
  if (!normalized.includes("insertcoin:")) {
    return { passed: false, message: "❌ Expected code to prompt 'Insert Coin: '." };
  }
  // Verify change owed output
  if (!normalized.includes("changeowed:")) {
    return { passed: false, message: "❌ Expected code to print 'Change Owed:' at the end." };
  }
  // Verify acceptance of standard US coin values
  if (!normalized.includes("25") || !normalized.includes("10") || !normalized.includes("5")) {
    return { passed: false, message: "❌ Expected code to accept 25, 10, and 5 cent coins." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
