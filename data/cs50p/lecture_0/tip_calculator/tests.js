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
  // Verify dollars_to_float() function is defined
  if (!normalized.includes("defdollars_to_float(")) {
    return { passed: false, message: "❌ Expected a function called dollars_to_float()." };
  }
  // Verify percent_to_float() function is defined
  if (!normalized.includes("defpercent_to_float(")) {
    return { passed: false, message: "❌ Expected a function called percent_to_float()." };
  }
  // Verify float() conversion is used
  if (!normalized.includes("float(")) {
    return { passed: false, message: "❌ Expected code to convert strings to float() values." };
  }
  // Verify character stripping ($ or %)
  if (!normalized.includes("strip(") && !normalized.includes("replace(")) {
    return { passed: false, message: "❌ Expected code to strip the '$' and '%' characters." };
  }
  // Verify percent_to_float divides by 100
  if (!normalized.includes("/100")) {
    return { passed: false, message: "❌ Expected percent_to_float to divide by 100." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
