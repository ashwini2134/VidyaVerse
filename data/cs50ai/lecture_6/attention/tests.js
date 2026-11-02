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
    ["defget_mask_token_index(", "get_mask_token_index()"],
    ["defget_color_for_attention_score(", "get_color_for_attention_score()"],
    ["defvisualize_attentions(", "visualize_attentions()"],
  ]) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} function.` };
    }
  }
  if (!normalized.includes("255")) {
    return { passed: false, message: "❌ Expected get_color_for_attention_score to scale to 255 (white)." };
  }
  if (!normalized.includes("generate_diagram(")) {
    return { passed: false, message: "❌ Expected visualize_attentions to call generate_diagram for each head/layer." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
