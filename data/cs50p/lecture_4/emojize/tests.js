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
  // Verify emoji module import
  if (!normalized.includes("importemoji") && !normalized.includes("fromemojiimport")) {
    return { passed: false, message: "❌ Expected code to import the emoji module." };
  }
  // Verify input() is used
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to read input with input()." };
  }
  // Verify emojize() is used
  if (!normalized.includes("emojize(")) {
    return { passed: false, message: "❌ Expected code to call emoji.emojize()." };
  }
  // Reject hardcoded literal emojis (e.g. 🍎, 🍔, 🍕, 🛫, etc.)
  if (/(?:[\u2700-\u27BF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF])/g.test(cleanCode)) {
    return { passed: false, message: "❌ Please use emoji.emojize() to convert text to emoji. Do not hardcode literal emojis." };
  }
  // Verify print() is used
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected code to print the emojized text." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
