export function runTests(code) {
  // Strip comments
  const cleanCode = code.replace(/#.*$/gm, '');
  
  // Check for input() usage (takes two numbers and an operator)
  const inputs = cleanCode.match(/input\s*\(/g);
  if (!inputs || inputs.length < 3) {
    return { passed: false, message: "❌ Expected code to use input() at least three times (two numbers, one operator)." };
  }
  
  // Check for integer casting int() or float()
  if (!cleanCode.match(/int\s*\(/) && !cleanCode.match(/float\s*\(/)) {
    return { passed: false, message: "❌ Expected code to cast inputs (e.g. using int())." };
  }

  // Remove string literals to check for logic operators outside of prints/strings
  const noStrings = cleanCode.replace(/(['"])(?:(?!\1)[^\\]|\\.)*\1/g, '""');
  
  if (!noStrings.includes("+") || !noStrings.includes("-") || !noStrings.includes("*") || !noStrings.includes("/")) {
    return { passed: false, message: "❌ Expected code to handle +, -, *, and / operators." };
  }

  // Check for conditional logic
  if (!noStrings.match(/\bif\b/) || (!noStrings.match(/\belse\b/) && !noStrings.match(/\belif\b/))) {
    return { passed: false, message: "❌ Expected if/elif conditional logic for the different operators." };
  }

  // Check for print
  if (!noStrings.includes("print")) {
    return { passed: false, message: "❌ Expected code to use print() to output the result." };
  }
  
  return { passed: true, message: "✅ All test cases passed!" };
}
