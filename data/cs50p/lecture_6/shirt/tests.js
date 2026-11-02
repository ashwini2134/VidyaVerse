export function runTests(code) {
  // Reject TODO/FIXME/placeholder code
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
  // Verify PIL/Pillow usage
  if (!normalized.includes("pil") && !normalized.includes("pillow")) {
    return { passed: false, message: "❌ Expected code to import from PIL (Pillow)." };
  }
  // Verify sys.argv file reading
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read two file names from sys.argv." };
  }
  // Verify ImageOps.fit is used to resize/crop input image
  if (!normalized.includes(".fit(")) {
    return { passed: false, message: "❌ Expected code to resize/crop with ImageOps.fit()." };
  }
  // Verify .paste is used to overlay the shirt on top of the input image
  if (!normalized.includes(".paste(")) {
    return { passed: false, message: "❌ Expected code to overlay the shirt with .paste()." };
  }
  // Verify .save is used to write output image
  if (!normalized.includes(".save(")) {
    return { passed: false, message: "❌ Expected code to save the result with .save()." };
  }
  // Verify sys.exit on error
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
