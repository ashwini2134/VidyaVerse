export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("defshortest_path(")) {
    return { passed: false, message: "❌ Expected a shortest_path(source, target) function." };
  }
  if (!normalized.includes("queuefrontier")) {
    return { passed: false, message: "❌ Expected breadth-first search using a QueueFrontier." };
  }
  if (!normalized.includes("neighbors_for_person(")) {
    return { passed: false, message: "❌ Expected use of the neighbors_for_person() helper to expand nodes." };
  }
  if (!normalized.includes("return")) {
    return { passed: false, message: "❌ Expected the function to return a path (or None)." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
