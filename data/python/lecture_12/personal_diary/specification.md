# Specification

## Requirements

1. Display a menu with options 1-6.
2. **Write a new entry:** Prompt for date, title, and multi-line content. Append to the diary file.
3. **View all entries:** Read the diary file and display every entry with date, title, and content.
4. **Search by date:** Show only entries matching a given date.
5. **Search by keyword:** Show only entries whose title or content contains a keyword (case-insensitive).
6. **Delete an entry:** Show numbered entries, prompt for which to delete, rewrite the file without it.
7. **Exit:** Print a goodbye message.

## Constraints

- Store entries in a text file named `diary.txt` in the same directory.
- Use a delimiter like `===ENTRY===` to separate entries in the file.
- Each entry in the file should store: date, title, and content (multi-line allowed).
- Handle the case where the diary file doesn't exist yet (first run).
- Use `open()` with the appropriate mode (`"a"` for append, `"r"` for read, `"w"` for write).
