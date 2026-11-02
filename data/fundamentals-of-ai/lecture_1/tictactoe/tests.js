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
    ["defplayer(", "player()"],
    ["defactions(", "actions()"],
    ["defresult(", "result()"],
    ["defwinner(", "winner()"],
    ["defterminal(", "terminal()"],
    ["defutility(", "utility()"],
    ["defminimax(", "minimax()"],
  ];
  for (const [needle, label] of required) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} function.` };
    }
  }
  if (!normalized.includes("deepcopy")) {
    return { passed: false, message: "❌ result() should return a deep copy, not mutate the original board." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
