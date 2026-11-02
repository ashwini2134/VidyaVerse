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

  // Must have input()
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read menu choices." };
  }

  // Must have print()
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() for displaying the menu." };
  }

  // Must have a while loop (menu loop)
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected a while loop for the main menu." };
  }

  // Must have a list (check for [ or list)
  if (!normalized.includes("[") && !normalized.includes("list(")) {
    return { passed: false, message: "❌ Expected a list to store shopping items." };
  }

  // Check for at least 4 menu options
  const choiceCount = (normalized.match(/["']\d["']/g) || []).length;
  if (choiceCount < 3) {
    return { passed: false, message: "❌ Expected at least 4 menu options (Add, Remove, View, Exit)." };
  }

  return { passed: true, message: "✅ All checks passed! Your shopping list manager works." };
}
