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
  // Verify parse function exists
  if (!normalized.includes("defparse(")) {
    return { passed: false, message: "❌ Expected a parse() function." };
  }
  // Verify regex method usage
  if (!normalized.includes("re.search(") && !normalized.includes("re.match(")) {
    return { passed: false, message: "❌ Expected code to use re.search()." };
  }
  // Verify returning youtu.be URL
  if (!normalized.includes("youtu.be")) {
    return { passed: false, message: "❌ Expected code to return a youtu.be URL." };
  }
  // Verify returning None when there is no match
  if (!normalized.includes("none")) {
    return { passed: false, message: "❌ Expected code to return None when there's no match." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
