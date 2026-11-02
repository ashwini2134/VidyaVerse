export async function runTests(code, { runPythonMock }) {
  // Reject TODO/FIXME/placeholder code
  if (/\b(TODO|FIXME|HACK|XXX|PLACEHOLDER)\b/i.test(code)) {
    return { passed: false, message: "❌ Code contains incomplete TODO/FIXME markers." };
  }

  if (!runPythonMock) {
    // Fallback if runPythonMock is missing
    return { passed: false, message: "❌ Testing engine is unavailable." };
  }

  const testCases = [
    { input: "Hello", expected: "$0" },
    { input: "Hello, Newman", expected: "$0" },
    { input: "How you doing?", expected: "$20" },
    { input: "What's happening?", expected: "$100" },
    { input: "   hello   ", expected: "$0" },
    { input: "HEY", expected: "$20" }
  ];

  for (const tc of testCases) {
    const steps = runPythonMock(code, tc.input);
    const lastStep = steps[steps.length - 1];
    
    if (lastStep && lastStep.error) {
      return { passed: false, message: `❌ Execution error on input "${tc.input}":\n${lastStep.error}` };
    }

    const outputStr = lastStep ? lastStep.outputs.join("\n").trim() : "";
    if (!outputStr.includes(tc.expected)) {
      return { 
        passed: false, 
        message: `❌ Failed for input "${tc.input}".\nExpected output to include: ${tc.expected}\nGot: ${outputStr || "No output"}`
      };
    }
  }

  return { passed: true, message: "✅ All test cases passed!" };
}
