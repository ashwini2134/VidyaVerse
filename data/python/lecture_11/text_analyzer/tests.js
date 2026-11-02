export function runTests(code) {
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

  // Must use input()
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read text." };
  }

  // Must use .split() for word count
  if (!normalized.includes(".split(")) {
    return { passed: false, message: "❌ Expected .split() to break text into words." };
  }

  // Must use .lower() for case-insensitive comparison
  if (!normalized.includes(".lower(")) {
    return { passed: false, message: "❌ Expected .lower() for case-insensitive unique word count." };
  }

  // Must use print()
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() to display results." };
  }

  // Check for word frequency counting (dict or Counter)
  if (!normalized.includes("{}") && !normalized.includes("counter") && !normalized.includes("dict(")) {
    return { passed: false, message: "❌ Expected a dictionary to count word frequencies." };
  }

  // Must count sentences (look for sentence-ending punctuation)
  if (!normalized.includes(".") && !normalized.includes("!")) {
    return { passed: false, message: "❌ Expected sentence counting logic (periods, exclamation marks)." };
  }

  return { passed: true, message: "✅ All checks passed! Your text analyzer works." };
}
