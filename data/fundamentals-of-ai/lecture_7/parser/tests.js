export function runTests(code) {
  const cleanCode = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const normalized = cleanCode.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "❌ Code cannot be empty or comments only." };
  }
  if (!normalized.includes("defpreprocess(")) {
    return { passed: false, message: "❌ Expected a preprocess() function." };
  }
  if (!normalized.includes("defnp_chunk(")) {
    return { passed: false, message: "❌ Expected an np_chunk() function." };
  }
  if (!normalized.includes("word_tokenize(")) {
    return { passed: false, message: "❌ Expected preprocess to tokenize with nltk.word_tokenize()." };
  }
  if (!normalized.includes(".isalpha(")) {
    return { passed: false, message: "❌ Expected preprocess to drop words with no alphabetic character (.isalpha())." };
  }
  if (!normalized.includes("s->")) {
    return { passed: false, message: "❌ Expected the NONTERMINALS grammar to define rules starting with 'S ->'." };
  }
  if (!normalized.includes("np->")) {
    return { passed: false, message: "❌ Expected the grammar to define an NP (noun phrase) rule." };
  }
  return { passed: true, message: "✅ All test cases passed!" };
}
