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

  // Must use open() for file handling
  if (!normalized.includes("open(")) {
    return { passed: false, message: "❌ Expected open() to read/write the diary file." };
  }

  // Must use input()
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read user input." });
  }

  // Must use print()
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() for output." };
  }

  // Must have a while loop
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected a while loop for the main menu." };
  }

  // Must handle file writing (check for "w" or "a" mode)
  if (!normalized.includes('"w"') && !normalized.includes("'w'") && 
      !normalized.includes('"a"') && !normalized.includes("'a'")) {
    return { passed: false, message: "❌ Expected file write or append mode (\"w\" or \"a\")." };
  }

  // Must handle file reading ("r" mode)
  if (!normalized.includes('"r"') && !normalized.includes("'r'")) {
    return { passed: false, message: "❌ Expected file read mode (\"r\")." };
  }

  return { passed: true, message: "✅ All checks passed! Your personal diary works." };
}
