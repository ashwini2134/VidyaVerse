export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  if (!normalized.includes(".split(")) {
    return { passed: false, message: "❌ Expected code to split the fraction on '/'." };
  }
  if (!normalized.includes("except")) {
    return { passed: false, message: "❌ Expected code to catch exceptions (ValueError / ZeroDivisionError)." };
  }
  if (!normalized.includes('"e"') && !normalized.includes("'e'")) {
    return { passed: false, message: "❌ Expected code to print 'E' when essentially empty." };
  }
  if (!normalized.includes('"f"') && !normalized.includes("'f'")) {
    return { passed: false, message: "❌ Expected code to print 'F' when essentially full." };
  }
  if (!normalized.includes("%")) {
    return { passed: false, message: "❌ Expected code to print the percentage with a '%' sign." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
