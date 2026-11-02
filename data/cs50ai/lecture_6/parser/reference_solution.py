# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
# The student fills in NONTERMINALS and implements preprocess and np_chunk;
# TERMINALS, grammar/parser wiring, and main are distribution code.
import nltk

NONTERMINALS = """
S -> NP VP | VP | S Conj S
AP -> Adj | Adj AP
NP -> N | Det NP | AP NP | N PP
PP -> P NP
VP -> V | V NP | V PP | VP Adv | Adv VP
"""


def preprocess(sentence):
    words = nltk.word_tokenize(sentence.lower())
    return [word for word in words if any(c.isalpha() for c in word)]


def np_chunk(tree):
    chunks = []
    for subtree in tree.subtrees(lambda t: t.label() == "NP"):
        if not any(
            inner.label() == "NP" and inner != subtree
            for inner in subtree.subtrees()
        ):
            chunks.append(subtree)
    return chunks
