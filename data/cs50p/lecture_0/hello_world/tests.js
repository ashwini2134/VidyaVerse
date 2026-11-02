export function runTests(code) {
  // Strip comments to prevent keyword spoofing
  const codeWithoutComments = code.replace(/#.*$/gm, '');

  const printRegex = /print\s*\(\s*(['"])(.*?)\1\s*\)/g;
  let match;
  let printedHello = false;
  let foundPrint = false;

  while ((match = printRegex.exec(codeWithoutComments)) !== null) {
    foundPrint = true;
    if (match[2] === "Hello, World!") {
      printedHello = true;
      break;
    }
  }

  if (printedHello) {
    return {
      passed: true,
      message: "✅ All test cases passed.",
    };
  }

  if (foundPrint) {
    return {
      passed: false,
      message: "❌ Found print statement, but expected exact string 'Hello, World!'",
    };
  }

  return {
    passed: false,
    message: "❌ Expected print('Hello, World!')",
  };
}