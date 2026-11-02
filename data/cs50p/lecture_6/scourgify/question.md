# Scourgify

Data often needs to be "cleaned," as by reformatting it so that values are in a consistent format. Consider a CSV file whose single `name` column combines last and first name (e.g. `"Potter, Harry"`). Not ideal for a mail merge.

In a file called `scourgify.py`, implement a program that:

- Expects the user to provide two command-line arguments:
  - the name of an existing CSV file to read as input, whose columns are assumed to be, in order, `name` and `house`, and
  - the name of a new CSV file to write as output, whose columns should be, in order, `first`, `last`, and `house`.
- Converts that input to that output, splitting each `name` into a `first` name and `last` name. Assume that each student will have both a first name and last name.

If the user does not provide exactly two command-line arguments, or if the first cannot be read, the program should exit via `sys.exit` with an error message.

## How to Test

- `python scourgify.py` → exits: `Too few command-line arguments`
- `python scourgify.py 1.csv 2.csv 3.csv` → exits: `Too many command-line arguments`
- `python scourgify.py missing.csv out.csv` → exits: `Could not read missing.csv`
- `python scourgify.py before.csv after.csv` → writes after.csv with columns `first,last,house`

```
check50 cs50/problems/2022/python/scourgify
```
