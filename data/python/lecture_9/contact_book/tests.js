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

  // Must use a dictionary (look for {} or dict())
  if (!normalized.includes("{}") && !normalized.includes("dict(")) {
    return { passed: false, message: "❌ Expected a dictionary to store contacts." };
  }

  // Must use input()
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read user input." };
  }

  // Must use print()
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() for output." };
  }

  // Must have a while loop
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected a while loop for the main menu." };
  }

  // Must handle at least 3 operations (check for menu number comparisons)
  const menuChecks = (normalized.match(/["']\d["']/g) || []).length;
  if (menuChecks < 3) {
    return { passed: false, message: "❌ Expected at least 4 menu options (Add, View, Search, Exit)." };
  }

  return { passed: true, message: "✅ All checks passed! Your contact book works." };
}
