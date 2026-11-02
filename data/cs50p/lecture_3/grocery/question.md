# Grocery List

Suppose that you're in the habit of making a list of items you need from the grocery store.

In a file called `grocery.py`, implement a program that prompts the user for items, one per line, until the user inputs control-d (EOF). Then output the user's grocery list in all uppercase, sorted alphabetically by item, prefixing each line with the number of times the user inputted that item. No need to pluralize the items. Treat the user's input case-insensitively.

## How to Test

- `mango`, `strawberry`, `^D` → `1 MANGO` / `1 STRAWBERRY`
- `milk`, `milk`, `^D` → `2 MILK`
- `tortilla`, `sweet potato`, `^D` → `1 SWEET POTATO` / `1 TORTILLA`

```
check50 cs50/problems/2022/python/grocery
```
