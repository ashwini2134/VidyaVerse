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

  // Must import random
  if (!normalized.includes("importrandom")) {
    return { passed: false, message: "❌ Expected import random." };
  }

  // Must use input() 
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read guesses." };
  }

  // Must use while loop
  if (!normalized.includes("while")) {
    return { passed: false, message: "❌ Expected a while loop for the guessing loop." };
  }

  // Must use random.randint() or random.choice()
  if (!normalized.includes("random.randint(") && !normalized.includes("random.choice(") && !normalized.includes("random.randrange(")) {
    return { passed: false, message: "❌ Expected random.randint() to generate the secret number." };
  }

  // Must use print()
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() to display messages." };
  }

  // Must handle difficulty levels (check for numbers 50, 100, 200 or keywords)
  if (!normalized.includes("easy") && !normalized.includes("medium") && !normalized.includes("hard")) {
    if (!normalized.includes("50") && !normalized.includes("100") && !normalized.includes("200")) {
      return { passed: false, message: "❌ Expected difficulty levels with different ranges (Easy/Medium/Hard)." };
    }
  }

  return { passed: true, message: "✅ All checks passed! Your guessing game works." };
}
