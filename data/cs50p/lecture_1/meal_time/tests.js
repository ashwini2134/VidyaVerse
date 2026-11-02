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
  // Verify main() function is defined
  if (!normalized.includes("defmain(")) {
    return { passed: false, message: "❌ Expected a main() function." };
  }
  // Verify convert() function is defined
  if (!normalized.includes("defconvert(")) {
    return { passed: false, message: "❌ Expected a convert() function." };
  }
  // Verify time parsing with .split() on ':'
  if (!normalized.includes(".split(")) {
    return { passed: false, message: "❌ Expected convert() to split the time on ':'." };
  }
  // Verify all three meal times are checked
  if (
    !normalized.includes("breakfasttime") ||
    !normalized.includes("lunchtime") ||
    !normalized.includes("dinnertime")
  ) {
    return { passed: false, message: "❌ Expected to print 'breakfast time', 'lunch time', and 'dinner time'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
