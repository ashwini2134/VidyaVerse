export function runTests(code) {
  // Remove comments
  const cleanCode = code.replace(/#.*$/gm, "");

  // Check input()
  const hasInput = /input\s*\(/.test(cleanCode);
  if (!hasInput) {
    return {
      passed: false,
      message: "❌ Expected code to use input().",
    };
  }

  // Check int()
  const hasInt = /int\s*\(/.test(cleanCode);
  if (!hasInt) {
    return {
      passed: false,
      message: "❌ Expected code to use int() to cast the input.",
    };
  }

  // Remove string literals
  const noStrings = cleanCode.replace(
    /(['"])(?:(?!\1)[^\\]|\\.)*\1/g,
    '""'
  );

  // Check modulo operator
  const hasModulo = /%\s*2/.test(noStrings);
  if (!hasModulo) {
    return {
      passed: false,
      message: "❌ Expected modulo operator (%) with 2.",
    };
  }

  // STRICT even check: must compare with 0
  const hasEvenLogic = /%\s*2\s*==\s*0/.test(noStrings);

  if (!hasEvenLogic) {
    return {
      passed: false,
      message: "❌ Expected even check using % 2 == 0.",
    };
  }

  // Check conditional logic
  const hasIf = /\bif\b/.test(noStrings);
  const hasElseOrElif =
    /\belse\b/.test(noStrings) ||
    /\belif\b/.test(noStrings);

  if (!hasIf || !hasElseOrElif) {
    return {
      passed: false,
      message: "❌ Expected if/else conditional logic.",
    };
  }

  // Check Even/Odd outputs
  const lowerCode = cleanCode.toLowerCase();

  const hasEvenPrint =
    lowerCode.includes('"even"') ||
    lowerCode.includes("'even'");

  const hasOddPrint =
    lowerCode.includes('"odd"') ||
    lowerCode.includes("'odd'");

  if (!hasEvenPrint) {
    return {
      passed: false,
      message: '❌ Expected code to print "Even".',
    };
  }

  if (!hasOddPrint) {
    return {
      passed: false,
      message: '❌ Expected code to print "Odd".',
    };
  }

  return {
    passed: true,
    message: "✅ All test cases passed!",
  };
}