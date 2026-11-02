export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("defmain(")) {
    return { passed: false, message: "❌ Expected a main() function." };
  }
  if (!normalized.includes("defis_valid(")) {
    return { passed: false, message: "❌ Expected an is_valid() function." };
  }
  if (!normalized.includes("len(")) {
    return { passed: false, message: "❌ Expected a length check (2–6 characters) using len()." };
  }
  if (!normalized.includes(".isalpha(") && !normalized.includes(".isalnum(") && !normalized.includes(".isdigit(")) {
    return { passed: false, message: "❌ Expected character-class checks (e.g. .isalpha()/.isdigit())." };
  }
  if (!normalized.includes('"valid"') && !normalized.includes("'valid'")) {
    return { passed: false, message: "❌ Expected the program to print 'Valid' / 'Invalid'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
