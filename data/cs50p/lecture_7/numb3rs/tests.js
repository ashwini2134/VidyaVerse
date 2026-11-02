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
  // Verify re import
  if (!normalized.includes("importre") && !normalized.includes("fromreimport")) {
    return { passed: false, message: "❌ Expected code to import the re module." };
  }
  // Verify validate function exists
  if (!normalized.includes("defvalidate(")) {
    return { passed: false, message: "❌ Expected a validate() function." };
  }
  // Verify regex method usage
  if (!normalized.includes("re.search(") && !normalized.includes("re.match(")) {
    return { passed: false, message: "❌ Expected code to use re.search() or re.match()." };
  }
  // Verify IP pattern octet capping (checking for 255-related logic in pattern)
  if (!normalized.includes("25[0-5]") && !normalized.includes("255")) {
    return { passed: false, message: "❌ Expected the pattern to cap each octet at 255." };
  }
  // Verify validate function returns a value
  if (!normalized.includes("return")) {
    return { passed: false, message: "❌ Expected validate() to return True/False." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
