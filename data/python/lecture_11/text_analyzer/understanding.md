# Understanding

The Text Analyzer combines several string manipulation techniques into a practical tool. You use `.split()` to break text into words, `.lower()` for case-insensitive comparison, `.strip()` to remove punctuation, and `set()` for unique value tracking. The word frequency counter introduces the **dictionary counting pattern** — `freq[word] = freq.get(word, 0) + 1` — which is one of the most common patterns in Python for tallying data.
