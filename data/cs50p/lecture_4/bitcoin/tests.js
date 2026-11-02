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
  // Verify requests import
  if (!normalized.includes("importrequests") && !normalized.includes("fromrequestsimport")) {
    return { passed: false, message: "❌ Expected code to import the requests module." };
  }
  // Verify command line arguments
  if (!normalized.includes("sys.argv")) {
    return { passed: false, message: "❌ Expected code to read the count from a command-line argument (sys.argv)." };
  }
  // Verify sys.exit on error
  if (!normalized.includes("sys.exit(")) {
    return { passed: false, message: "❌ Expected code to exit via sys.exit() on bad/missing input." };
  }
  // Verify requests.get API query
  if (!normalized.includes(".get(")) {
    return { passed: false, message: "❌ Expected code to query the API with requests.get()." };
  }
  // Verify JSON access parsing
  if (!normalized.includes(".json(")) {
    return { passed: false, message: "❌ Expected code to parse the JSON response with .json()." };
  }
  // Verify currency formatting to 4 decimals with thousands separator
  if (!normalized.includes(",.4f")) {
    return { passed: false, message: "❌ Expected USD formatted to 4 decimals with a thousands separator (e.g. f\"${total:,.4f}\")." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
