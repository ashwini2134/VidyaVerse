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

  // Must use dictionaries (nested: student -> subject -> grade)
  if (!normalized.includes("{}") && !normalized.includes("dict(")) {
    return { passed: false, message: "❌ Expected a dictionary to store students and grades." };
  }

  // Must use open() for file save/load
  if (!normalized.includes("open(")) {
    return { passed: false, message: "❌ Expected open() for saving/loading data." };
  }

  // Must use input() and print()
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read user input." };
  }
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() for output." };
  }

  // Must have a while loop
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected a while loop for the main menu." };
  }

  // Must define at least 3 functions
  const defCount = (normalized.match(/\bdef\b/g) || []).length;
  if (defCount < 3) {
    return { passed: false, message: "❌ Expected at least 3 function definitions using def." };
  }

  // Must handle letter grades (check for 'a' and 'b' and 'f' grade thresholds)
  if (!normalized.includes("90") && !normalized.includes("89") && !normalized.includes("80")) {
    return { passed: false, message: "❌ Expected letter grade calculation (A/B/C/D/F thresholds)." };
  }

  return { passed: true, message: "✅ All checks passed! Your grade tracker works." };
}
