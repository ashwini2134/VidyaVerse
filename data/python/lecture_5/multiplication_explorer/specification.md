# Specification

## Requirements

1. Prompt the user for a table size `n` (positive integer).
2. Print a header row showing column numbers 1 through `n`.
3. For each row `i` from 1 to `n`:
   - Print the row number as the first column.
   - Print the products `i * j` for each column `j` from 1 to `n`.
4. Align numbers using f-string formatting so columns line up neatly.
5. Handle invalid input (non-positive or non-integer) by prompting again.

## Constraints

- Use nested `for` loops.
- Use f-string formatting with width specifiers for alignment (e.g., `f"{value:4}"`).
- No external libraries.
