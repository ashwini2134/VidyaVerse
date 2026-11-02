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
    ["defjoint_probability(", "joint_probability()"],
    ["defupdate(", "update()"],
    ["defnormalize(", "normalize()"],
  ]) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} function.` };
    }
  }
  if (!normalized.includes("probs[") && !normalized.includes('probs["')) {
    return { passed: false, message: "❌ Expected use of the PROBS distributions." };
  }
  if (!normalized.includes("mutation")) {
    return { passed: false, message: "❌ Expected inheritance to account for PROBS['mutation']." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
