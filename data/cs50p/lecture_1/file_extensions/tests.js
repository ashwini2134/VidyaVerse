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
  // Verify input() is used to read file name
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify MIME type mappings are present
  if (!normalized.includes("image/jpeg") || !normalized.includes("application/pdf")) {
    return { passed: false, message: "❌ Expected the correct media types (e.g. image/jpeg, application/pdf)." };
  }
  // Verify default MIME type for unknown extensions
  if (!normalized.includes("application/octet-stream")) {
    return { passed: false, message: "❌ Expected application/octet-stream as the default." };
  }
  // Verify case-insensitive file extension checking
  if (!normalized.includes("endswith(") && !normalized.includes(".lower(")) {
    return { passed: false, message: "❌ Expected case-insensitive suffix checking (e.g. .endswith())." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
