export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  const required = [
    ["defknown_mines(", "Sentence.known_mines()"],
    ["defknown_safes(", "Sentence.known_safes()"],
    ["defmark_mine(", "mark_mine()"],
    ["defmark_safe(", "mark_safe()"],
    ["defadd_knowledge(", "add_knowledge()"],
    ["defmake_safe_move(", "make_safe_move()"],
    ["defmake_random_move(", "make_random_move()"],
  ];
  for (const [needle, label] of required) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} method.` };
    }
  }
  if (!normalized.includes("issubset(") && !normalized.includes("subset")) {
    return { passed: false, message: "❌ Expected subset-based inference (set2 - set1) in add_knowledge()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
