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
  // Verify validator packages import
  if (!normalized.includes("validators") && !normalized.includes("validator_collection")) {
    return { passed: false, message: "❌ Expected code to use the validators (or validator-collection) package." };
  }
  // Verify input prompting
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to prompt for an email with input()." };
  }
  // Verify expected outputs
  if (!normalized.includes('"valid"') && !normalized.includes("'valid'")) {
    return { passed: false, message: "❌ Expected code to print 'Valid' / 'Invalid'." };
  }
  // Strictly forbid re module usage
  if (normalized.includes("importre") || normalized.includes("import re")) {
    return { passed: false, message: "❌ This problem forbids using the re module. Please use a validator package instead." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
