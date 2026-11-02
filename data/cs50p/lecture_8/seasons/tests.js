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
  // Verify inflect import
  if (!normalized.includes("importinflect") && !normalized.includes("frominflectimport")) {
    return { passed: false, message: "❌ Expected code to import the inflect module." };
  }
  // Verify datetime.date usage
  if (!normalized.includes("date")) {
    return { passed: false, message: "❌ Expected code to use datetime.date." };
  }
  // Verify inflect's number_to_words method usage
  if (!normalized.includes("number_to_words(")) {
    return { passed: false, message: "❌ Expected code to convert the number to words with inflect's number_to_words()." };
  }
  // Verify sys.exit on invalid date input format
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on an invalid date." };
  }
  // Verify output keyword
  if (!normalized.includes("minutes")) {
    return { passed: false, message: "❌ Expected output ending in 'minutes'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
