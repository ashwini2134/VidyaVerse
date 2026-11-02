# Pizza Py

A CSV file isn't the most customer-friendly format to look at. Prettier might be a table, formatted as ASCII art.

In a file called `pizza.py`, implement a program that expects exactly one command-line argument, the name (or path) of a CSV file in Pinocchio's format, and outputs a table formatted as ASCII art using `tabulate`, a package on PyPI (`pip install tabulate`). Format the table using the library's `grid` format. If the user does not specify exactly one command-line argument, or if the specified file's name does not end in `.csv`, or if the specified file does not exist, the program should instead exit via `sys.exit`.

## How to Test

- `python pizza.py` → exits: `Too few command-line arguments`
- `python pizza.py a.csv b.csv` → exits: `Too many command-line arguments`
- `python pizza.py sicilian.txt` → exits: `Not a CSV file`
- `python pizza.py missing.csv` → exits: `File does not exist`
- `python pizza.py regular.csv` → prints a grid-format table

```
check50 cs50/problems/2022/python/pizza
```
