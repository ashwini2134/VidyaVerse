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
    ["defload_data(", "load_data()"],
    ["deftrain_model(", "train_model()"],
    ["defevaluate(", "evaluate()"],
  ]) {
    if (!normalized.includes(needle)) {
      return { passed: false, message: `❌ Expected a ${label} function.` };
    }
  }
  if (!normalized.includes("kneighborsclassifier(")) {
    return { passed: false, message: "❌ Expected train_model to use KNeighborsClassifier (k=1)." };
  }
  if (!normalized.includes("n_neighbors=1")) {
    return { passed: false, message: "❌ Expected the classifier to use n_neighbors=1." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
