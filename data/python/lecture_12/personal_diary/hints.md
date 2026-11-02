# Hints

1. Use a delimiter like `===ENTRY===` to separate entries so you can parse them back.
2. Use `os.path.exists(FILE_NAME)` to check if the diary file exists before reading.
3. Use `"a"` mode for appending new entries and `"r"` for reading all entries.
4. Use list comprehension with a condition to filter search results: `[e for e in entries if keyword in e['title']]`.
5. When deleting, load all entries, remove the selected one, and rewrite the entire file with `"w"` mode.
