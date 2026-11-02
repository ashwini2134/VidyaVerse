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
  // Verify pyfiglet usage
  if (!normalized.includes("pyfiglet") && !normalized.includes("figlet")) {
    return { passed: false, message: "❌ Expected code to use pyfiglet's Figlet." };
  }
  // Verify sys.argv usage for font selection logic
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read command-line arguments via sys.argv." };
  }
  // Verify sys.exit on error validation
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on invalid usage." };
  }
  // Verify renderText is used
  if (!normalized.includes("rendertext(")) {
    return { passed: false, message: "❌ Expected code to render text with figlet.renderText()." };
  }
  // Reject hardcoded large ASCII art (detecting block structures or common figlet outputs)
  if (normalized.includes("___|") || normalized.includes("/\\_\\") || normalized.includes("|_|")) {
    return { passed: false, message: "❌ Do not hardcode the ASCII art output. Use pyfiglet's Figlet to render the text dynamically." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
