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
    ["deftransition_model(", "transition_model()"],
    ["defsample_pagerank(", "sample_pagerank()"],
    ["defiterate_pagerank(", "iterate_pagerank()"],
  ]) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} function.` };
    }
  }
  if (!normalized.includes("damping_factor")) {
    return { passed: false, message: "❌ Expected use of the damping_factor." };
  }
  if (!normalized.includes("0.001")) {
    return { passed: false, message: "❌ Expected iterate_pagerank to converge within 0.001." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
