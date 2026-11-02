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
  // Verify input() is used to read snake_case string
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify for loop for iteration
  if (!normalized.includes("for")) {
    return { passed: false, message: "❌ Expected code to use a for loop to iterate through characters." };
  }
  // Verify uppercase/lowercase detection
  if (!normalized.includes(".isupper(") && !normalized.includes(".islower(")) {
    return { passed: false, message: "❌ Expected code to detect uppercase letters (e.g. .isupper())." };
  }
  // Verify underscore insertion
  if (!normalized.includes('"_"') && !normalized.includes("'_'")) {
    return { passed: false, message: "❌ Expected code to insert an underscore before each capitalized word." };
  }
  // Verify print() for output
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the snake_case result." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
