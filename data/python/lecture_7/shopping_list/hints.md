# Hints

1. Start with an empty list to hold your items. Each item can be a dictionary: `{"name": "...", "purchased": False}`.
2. Wrap the entire program in a `while True` loop to keep showing the menu.
3. Use `if`/`elif` chains to handle each menu option.
4. Use a `for` loop with `enumerate(items, 1)` to display numbered items.
5. Use list comprehension `[item for item in items if not item["purchased"]]` to clear purchased items.
