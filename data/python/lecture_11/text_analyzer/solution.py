lines = []
print("--- Text Analyzer ---")
print("Enter a paragraph (or type 'done' to finish):")
while True:
    line = input()
    if line.strip().lower() == "done":
        break
    lines.append(line)

text = "\n".join(lines)

char_with_spaces = len(text)
char_without_spaces = len(text.replace(" ", "").replace("\n", ""))
words = text.split()
word_count = len(words)
avg_word_length = sum(len(w.strip(".,!?;:")) for w in words) / word_count if word_count > 0 else 0
sentences = text.count(".") + text.count("!") + text.count("?")

cleaned_words = [w.strip(".,!?;:").lower() for w in words]
unique_words = len(set(cleaned_words))

freq = {}
for w in cleaned_words:
    freq[w] = freq.get(w, 0) + 1
most_common = max(freq, key=freq.get) if freq else ""

print("\n--- Analysis Results ---")
print(f"Original text: {char_with_spaces} characters ({char_without_spaces} without spaces)")
print(f"Word count: {word_count}")
print(f"Average word length: {avg_word_length:.1f} characters")
print(f"Number of sentences: {sentences}")
print(f"Unique words: {unique_words}")
if most_common:
    print(f'Most common word: "{most_common}" (appears {freq[most_common]} times)')
