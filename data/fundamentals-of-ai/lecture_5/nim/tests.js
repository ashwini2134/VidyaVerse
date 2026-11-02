export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  for (const [needle, label] of [
    ["defget_q_value(", "get_q_value()"],
    ["defupdate_q_value(", "update_q_value()"],
    ["defbest_future_reward(", "best_future_reward()"],
    ["defchoose_action(", "choose_action()"],
  ]) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} method.` };
    }
  }
  if (!normalized.includes("self.alpha")) {
    return { passed: false, message: "❌ Expected the Q-learning update to use self.alpha." };
  }
  if (!normalized.includes("self.epsilon")) {
    return { passed: false, message: "❌ Expected choose_action to use self.epsilon for exploration." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
