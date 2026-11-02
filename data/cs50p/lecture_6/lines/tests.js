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
  // Verify sys.argv usage for command line input
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read the file name from sys.argv." };
  }
  // Verify check for .py file extension
  if (!normalized.includes(".py")) {
    return { passed: false, message: "❌ Expected code to check the file ends in '.py'." };
  }
  // Verify sys.exit call on misuse
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  // Verify file opening
  if (!normalized.includes("open(")) {
    return { passed: false, message: "❌ Expected code to open the file." };
  }
  // Verify comment and blank line filtering logic
  if (!normalized.includes("startswith(") && !normalized.includes(".lstrip(")) {
    return { passed: false, message: "❌ Expected code to detect comment lines (e.g. .lstrip()/.startswith('#'))." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
