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
    ["defenforce_node_consistency(", "enforce_node_consistency()"],
    ["defrevise(", "revise()"],
    ["defac3(", "ac3()"],
    ["defassignment_complete(", "assignment_complete()"],
    ["defconsistent(", "consistent()"],
    ["deforder_domain_values(", "order_domain_values()"],
    ["defselect_unassigned_variable(", "select_unassigned_variable()"],
    ["defbacktrack(", "backtrack()"],
  ];
  for (const [needle, label] of required) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} function.` };
    }
  }
  if (!normalized.includes("overlaps")) {
    return { passed: false, message: "❌ Expected use of self.crossword.overlaps for binary constraints." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
