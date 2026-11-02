export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("defload_data(")) {
    return { passed: false, message: "❌ Expected a load_data(data_dir) function." };
  }
  if (!normalized.includes("defget_model(")) {
    return { passed: false, message: "❌ Expected a get_model() function." };
  }
  if (!normalized.includes(".resize(")) {
    return { passed: false, message: "❌ Expected load_data to resize images to IMG_WIDTH x IMG_HEIGHT." };
  }
  if (!normalized.includes("conv2d(")) {
    return { passed: false, message: "❌ Expected get_model to build a convolutional network (Conv2D)." };
  }
  if (!normalized.includes("num_categories")) {
    return { passed: false, message: "❌ Expected the output layer to have NUM_CATEGORIES units." };
  }
  if (!normalized.includes(".compile(")) {
    return { passed: false, message: "❌ Expected get_model to return a compiled model." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
