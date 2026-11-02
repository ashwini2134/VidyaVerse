export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  for (const kb of ["knowledge0", "knowledge1", "knowledge2", "knowledge3"]) {
    if (!normalized.includes(kb + "=and(") && !normalized.includes(kb + "=")) {
      return { passed: false, message: `❌ Expected ${kb} to be populated.` };
    }
  }
  if (!normalized.includes("and(")) {
    return { passed: false, message: "❌ Expected use of the And() connective." };
  }
  if (!normalized.includes("implication(") && !normalized.includes("biconditional(")) {
    return { passed: false, message: "❌ Expected use of Implication() or Biconditional() to encode what each character says." };
  }
  if (!normalized.includes("aknight") || !normalized.includes("aknave")) {
    return { passed: false, message: "❌ Expected the AKnight/AKnave (etc.) symbols to be used." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
