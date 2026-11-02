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
  // Verify convert() function is defined
  if (!normalized.includes("defconvert(")) {
    return { passed: false, message: "❌ Expected a function called convert()." };
  }
  // Verify main() function is defined
  if (!normalized.includes("defmain(")) {
    return { passed: false, message: "❌ Expected a function called main()." };
  }
  // Verify .replace() method is used
  if (!normalized.includes(".replace(")) {
    return { passed: false, message: "❌ Expected code to use the .replace() string method." };
  }
  // Verify both emoji replacements are present
  if (!normalized.includes("🙂") || !normalized.includes("🙁")) {
    return { passed: false, message: "❌ Expected code to convert :) and :( into 🙂 and 🙁." };
  }
  // Verify print() is called from main()
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected main() to print the converted result." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
