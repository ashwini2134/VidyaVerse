# Lines of Code

One way to measure the complexity of a program is to count its number of lines of code (LOC), excluding blank lines and comments.

In a file called `lines.py`, implement a program that expects exactly one command-line argument, the name (or path) of a Python file, and outputs the number of lines of code in that file, excluding comments and blank lines. If the user does not specify exactly one command-line argument, or if the specified file's name does not end in `.py`, or if the specified file does not exist, the program should instead exit via `sys.exit`.

Assume that any line that starts with `#`, optionally preceded by whitespace, is a comment. (A docstring should not be considered a comment.) Assume that any line that only contains whitespace is blank.

## How to Test

- `python lines.py` → exits: `Too few command-line arguments`
- `python lines.py a.py b.py` → exits: `Too many command-line arguments`
- `python lines.py notes.txt` → exits: `Not a Python file`
- `python lines.py missing.py` → exits: `File does not exist`
- `python lines.py hello.py` → prints the LOC count

```
check50 cs50/problems/2022/python/lines
```
