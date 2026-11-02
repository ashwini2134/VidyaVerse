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
  // Verify input() is used to read the answer
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify 42 is checked
  if (!normalized.includes("42")) {
    return { passed: false, message: "❌ Expected code to check for '42'." };
  }
  // Verify both forms of 'forty-two' and 'forty two' are checked
  if (!normalized.includes("forty-two") && !normalized.includes("fortytwo")) {
    return { passed: false, message: "❌ Expected code to check for 'forty-two' and 'forty two'." };
  }
  // Verify 'yes' output
  if (!normalized.includes('"yes"') && !normalized.includes("'yes'")) {
    return { passed: false, message: "❌ Expected code to print 'Yes' for a correct answer." };
  }
  // Verify 'no' output
  if (!normalized.includes('"no"') && !normalized.includes("'no'")) {
    return { passed: false, message: "❌ Expected code to print 'No' otherwise." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
