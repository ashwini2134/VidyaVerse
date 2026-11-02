# Specification

## Requirements

1. Let the user input multiple lines of text. Stop when they type "done" on a line by itself.
2. Calculate and display:
   - Total character count (with and without spaces)
   - Word count (split by whitespace)
   - Average word length (in characters, one decimal place)
   - Number of sentences (count of `.`, `!`, `?`)
   - Number of unique words (case-insensitive)
   - The most common word and how many times it appears
3. Display all results with clear labels.

## Constraints

- Use string methods like `.split()`, `.lower()`, `.strip()`, `.count()`.
- Use a list or set for unique word tracking.
- Use a dictionary for word frequency counting.
- Ignore punctuation when counting words (strip `.`, `,`, `!`, `?`, `;`, `:` from word edges).
