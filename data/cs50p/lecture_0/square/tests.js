export function runTests(code) {
  // Strip comments
  const cleanCode = code.replace(/#.*$/gm, '');
  
  // Check for input() usage
  if (!cleanCode.match(/input\s*\(/)) {
    return { passed: false, message: "❌ Expected code to use input()." };
  }
  
  // Check for integer casting int() or float()
  if (!cleanCode.match(/int\s*\(/) && !cleanCode.match(/float\s*\(/)) {
    return { passed: false, message: "❌ Expected code to cast input (e.g. using int())." };
  }

  // Remove string literals to check for logic operators outside of prints/strings
  const noStrings = cleanCode.replace(/(['"])(?:(?!\1)[^\\]|\\.)*\1/g, '""');
  
  if (!noStrings.includes("**") && !noStrings.includes("*")) {
    return { passed: false, message: "❌ Expected code to calculate square using ** or multiplication." };
  }

  // Check for print
  if (!noStrings.includes("print")) {
    return { passed: false, message: "❌ Expected code to use print() to output the result." };
  }
  
  return { passed: true, message: "✅ All test cases passed!" };
}
