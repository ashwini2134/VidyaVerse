export function runTests(code) {
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

  // Must use input() to get size
  if (!normalized.includes("input(")) {
    return { passed: false, message: "❌ Expected input() to read the table size." };
  }

  // Must use at least one for loop
  if (!normalized.includes("for")) {
    return { passed: false, message: "❌ Expected a for loop to build the multiplication table." };
  }

  // Must use nested loops (two for's)
  const forCount = (normalized.match(/for/g) || []).length;
  if (forCount < 2) {
    return { passed: false, message: "❌ Expected nested for loops (at least 2 for statements)." };
  }

  // Must use print()
  if (!normalized.includes("print(")) {
    return { passed: false, message: "❌ Expected print() to display the table." };
  }

  // Must use range()
  if (!normalized.includes("range(")) {
    return { passed: false, message: "❌ Expected range() to iterate over numbers." };
  }

  // Must convert input to int
  if (!normalized.includes("int(")) {
    return { passed: false, message: "❌ Expected int() to convert input to a number." };
  }

  return { passed: true, message: "✅ All checks passed! Your multiplication explorer works." };
}
