# Specification

## Requirements

1. Display a menu with options 1-6.
2. **Add item:** Prompt for item name and append it to the list with "not purchased" status.
3. **Remove item:** Show numbered list, prompt for the number to remove.
4. **View list:** Display all items with their status (`[ ]` = not purchased, `[x]` = purchased).
5. **Mark as purchased:** Show numbered list, prompt for the number to mark as purchased.
6. **Clear purchased items:** Remove all items marked as purchased from the list.
7. **Exit:** Print a goodbye message and exit.
8. The program should keep showing the menu until the user chooses Exit.

## Constraints

- Use a list of strings for item names and a separate list of booleans for purchase status, OR use a list of dictionaries like `{"name": "apples", "purchased": False}`.
- Validate menu choices (re-prompt if invalid).
- Validate item numbers when removing or marking as purchased.
