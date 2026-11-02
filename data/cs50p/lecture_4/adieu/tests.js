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
  // Verify inflect usage
  if (!normalized.includes("importinflect") && !normalized.includes("frominflectimport")) {
    return { passed: false, message: "❌ Expected code to import the inflect module." };
  }
  // Verify EOF handling (control-d) using try-except EOFError
  if (!normalized.includes("eoferror")) {
    return { passed: false, message: "❌ Expected code to read names until EOFError (control-d)." };
  }
  // Verify list accumulation (e.g. they should have a list or append names)
  if (!normalized.includes(".append(") && !normalized.includes("+=")) {
    return { passed: false, message: "❌ Expected code to accumulate names in a list or collection." };
  }
  // Verify inflect's join method is used
  if (!normalized.includes(".join(")) {
    return { passed: false, message: "❌ Expected code to join the names with inflect's .join()." };
  }
  // Verify required output components
  if (!normalized.includes("adieu") || !normalized.includes("to")) {
    return { passed: false, message: "❌ Expected output beginning with 'Adieu, adieu, to '." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
