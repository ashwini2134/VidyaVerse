export function runTests(code) {
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

  // Must use input() at least 4 times
  const inputMatches = normalized.match(/input\(/g);
  if (!inputMatches || inputMatches.length < 4) {
    return { passed: false, message: "❌ Expected at least 4 input() calls (name, age, color, hobby)." };
  }

  // Must use print() at least 4 times (for 4 story lines)
  const printMatches = normalized.match(/print\(/g);
  if (!printMatches || printMatches.length < 4) {
    return { passed: false, message: "❌ Expected at least 4 print() calls to tell the story." };
  }

  // Must use f-string (f" or f')
  if (!normalized.includes('f"') && !normalized.includes("f'")) {
    return { passed: false, message: "❌ Expected f-strings for embedding variables. Use f\"...{var}...\" syntax." };
  }

  return { passed: true, message: "✅ All checks passed! Your story generator works." };
}
