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
  // Verify random module usage
  if (!normalized.includes("importrandom") && !normalized.includes("fromrandomimport")) {
    return { passed: false, message: "❌ Expected code to import the random module." };
  }
  // Verify get_level function
  if (!normalized.includes("defget_level(")) {
    return { passed: false, message: "❌ Expected a get_level() function." };
  }
  // Verify generate_integer function
  if (!normalized.includes("defgenerate_integer(")) {
    return { passed: false, message: "❌ Expected a generate_integer(level) function." };
  }
  // Verify EEE output on wrong answers
  if (!normalized.includes('"eee"') && !normalized.includes("'eee'")) {
    return { passed: false, message: "❌ Expected code to print 'EEE' on a wrong answer." };
  }
  // Verify score output tracking
  if (!normalized.includes("score:")) {
    return { passed: false, message: "❌ Expected code to print 'Score: <n>'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
