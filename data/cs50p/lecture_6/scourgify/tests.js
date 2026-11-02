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
  // Verify csv import
  if (!normalized.includes("importcsv") && !normalized.includes("fromcsvimport")) {
    return { passed: false, message: "❌ Expected code to use the csv module." };
  }
  // Verify sys.argv file reading
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read two file names from sys.argv." };
  }
  // Verify csv.DictReader and csv.DictWriter are used
  if (!normalized.includes("dictreader") && !normalized.includes("dictwriter")) {
    return { passed: false, message: "❌ Expected code to use csv.DictReader / csv.DictWriter." };
  }
  // Verify splitting columns names first, last, house
  if (!normalized.includes('"first"') && !normalized.includes("'first'")) {
    return { passed: false, message: "❌ Expected output columns first, last, house." };
  }
  // Verify sys.exit on error
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on misuse." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
