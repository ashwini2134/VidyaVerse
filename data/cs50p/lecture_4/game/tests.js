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
  // Verify picking random number
  if (!normalized.includes("randint(") && !normalized.includes("randrange(")) {
    return { passed: false, message: "❌ Expected code to pick a random number (e.g. random.randint())." };
  }
  // Verify while loop for repeated prompting and validation
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected code to use a while loop for repeated prompting and game flow." };
  }
  // Verify comparison logic outputs
  if (!normalized.includes("toosmall!")) {
    return { passed: false, message: "❌ Expected code to print 'Too small!'." };
  }
  if (!normalized.includes("toolarge!")) {
    return { passed: false, message: "❌ Expected code to print 'Too large!'." };
  }
  if (!normalized.includes("justright!")) {
    return { passed: false, message: "❌ Expected code to print 'Just right!'." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
