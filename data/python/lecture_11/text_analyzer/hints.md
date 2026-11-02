# Hints

1. Use a `while True` loop to collect multi-line input, breaking when the user types "done".
2. Use `"\n".join(lines)` to combine all input lines into one string.
3. Use `text.split()` to get a list of words (splits on any whitespace).
4. Use a dictionary to count word frequencies: `freq[word] = freq.get(word, 0) + 1`.
5. Use `set(cleaned_words)` to find unique words. Use `max(freq, key=freq.get)` to find the most common.
