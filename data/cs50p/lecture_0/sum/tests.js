export function runTests(code) {
  // Strip comments
  const cleanCode = code.replace(/#.*$/gm, '');
  
  // Check for input() usage (at least twice)
  const inputs = cleanCode.match(/input\s*\(/g);
  if (!inputs || inputs.length < 2) {
    return { passed: false, message: "❌ Expected code to use input() at least twice." };
  }
  
  // Check for integer casting int()
  const ints = cleanCode.match(/int\s*\(/g);
  if (!ints || ints.length < 2) {
    return { passed: false, message: "❌ Expected code to use int() to cast inputs." };
  }
  
  // Remove string literals to check for logic operators outside of prints/strings
  const noStrings = cleanCode.replace(/(['"])(?:(?!\1)[^\\]|\\.)*\1/g, '""');
  
  if (!noStrings.includes("+")) {
    return { passed: false, message: "❌ Expected addition operator (+) outside of strings." };
  }
  
  // Check for print
  if (!noStrings.includes("print")) {
    return { passed: false, message: "❌ Expected code to use print() to output the result." };
  }

  return { passed: true, message: "✅ All test cases passed!" };
}
