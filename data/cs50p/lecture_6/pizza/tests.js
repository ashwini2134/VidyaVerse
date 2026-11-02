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
  // Verify tabulate import
  if (!normalized.includes("tabulate")) {
    return { passed: false, message: "❌ Expected code to use the tabulate package." };
  }
  // Verify sys.argv file reading
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read the file name from sys.argv." };
  }
  // Verify .csv extension check
  if (!normalized.includes(".csv")) {
    return { passed: false, message: "❌ Expected code to check the file ends in '.csv'." };
  }
  // Verify sys.exit on error
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  // Verify 'grid' format usage in tabulate
  if (!normalized.includes("grid")) {
    return { passed: false, message: "❌ Expected the table to use tabulate's 'grid' format." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
