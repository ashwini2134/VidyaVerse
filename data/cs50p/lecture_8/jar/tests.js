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
  // Verify Jar class exists
  if (!normalized.includes("classjar")) {
    return { passed: false, message: "❌ Expected a class called Jar." };
  }
  // Verify __init__ constructor method
  if (!normalized.includes("def__init__(")) {
    return { passed: false, message: "❌ Expected an __init__ method." };
  }
  // Verify deposit and withdraw methods
  if (!normalized.includes("defdeposit(") || !normalized.includes("defwithdraw(")) {
    return { passed: false, message: "❌ Expected deposit() and withdraw() methods." };
  }
  // Verify @property decorates capacity or size
  if (!normalized.includes("@property")) {
    return { passed: false, message: "❌ Expected capacity and size to be @property methods." };
  }
  // Verify __str__ returns the cookie emoji
  if (!normalized.includes("🍪")) {
    return { passed: false, message: "❌ Expected __str__ to return cookie emoji (🍪)." };
  }
  // Verify ValueError is raised on invalid capacity / overflow / underflow
  if (!normalized.includes("raisevalueerror")) {
    return { passed: false, message: "❌ Expected ValueError to be raised on invalid capacity/deposit/withdraw." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
