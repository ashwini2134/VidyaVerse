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
  // Verify FPDF module usage
  if (!normalized.includes("fpdf")) {
    return { passed: false, message: "❌ Expected code to use fpdf2 (from fpdf import FPDF)." };
  }
  // Verify input prompting
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected code to prompt for a name with input()." };
  }
  // Verify PDF layout is A4
  if (!normalized.includes('"a4"') && !normalized.includes("'a4'")) {
    return { passed: false, message: "❌ Expected the PDF format to be A4." };
  }
  // Verify placement of shirt image asset
  if (!normalized.includes("shirtificate.png")) {
    return { passed: false, message: "❌ Expected code to place the shirtificate.png image." };
  }
  // Verify PDF write output
  if (!normalized.includes(".output(")) {
    return { passed: false, message: "❌ Expected code to write the PDF with .output()." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
