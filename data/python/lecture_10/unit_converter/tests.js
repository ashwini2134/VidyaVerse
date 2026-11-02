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

  // Must define at least 3 function using 'def'
  const defCount = (normalized.match(/\bdef\b/g) || []).length;
  if (defCount < 3) {
    return { passed: false, message: "❌ Expected at least 3 function definitions using def." };
  }

  // Must use at least one return statement
  if (!normalized.includes("return")) {
    return { passed: false, message: "❌ Expected functions to use return statements." };
  }

  // Must use input()
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read user input." };
  }

  // Must have a loop
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected a while loop for the main menu." };
  }

  // Must convert input to float
  if (!normalized.includes("float(")) {
    return { passed: false, message: "❌ Expected float() to convert input to a number." };
  }

  return { passed: true, message: "✅ All checks passed! Your unit converter toolkit works." };
}
