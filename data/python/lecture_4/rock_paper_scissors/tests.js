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
    return { passed: false, message: "❌ Expected import random at the top of your program." };
  }

  // Must use input() to get user choice
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read the user's choice." };
  }

  // Must use random.choice() or random.randint
  if (!normalized.includes("random.choice(") && !normalized.includes("random.randint(")) {
    return { passed: false, message: "❌ Expected random.choice() or random.randint() for computer choice." };
  }

  // Must use print() for output
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() to display results." };
  }

  // Must handle 'rock', 'paper', 'scissors' keywords
  if (!normalized.includes("rock") || !normalized.includes("paper") || !normalized.includes("scissors")) {
    return { passed: false, message: "❌ Expected code to handle rock, paper, and scissors choices." };
  }

  // Must have some form of loop (while or for)
  if (!normalized.includes("while") && !normalized.includes("for")) {
    return { passed: false, message: "❌ Expected a loop to allow multiple rounds." };
  }

  return { passed: true, message: "✅ All checks passed! Your Rock, Paper, Scissors game works." };
}
