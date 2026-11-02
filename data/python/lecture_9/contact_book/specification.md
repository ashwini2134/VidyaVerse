# Specification

## Requirements

1. Display a menu with options 1-6.
2. **Add contact:** Prompt for name, phone, email. Store as a dictionary with the name as a key.
3. **View all contacts:** Display all contacts alphabetically by name.
4. **Search by name:** Look up a contact by name and display their details. Show "not found" if missing.
5. **Update phone:** Search by name, then update the phone number.
6. **Delete contact:** Remove a contact by name.
7. **Exit:** Print a goodbye message.
8. Keep showing the menu until Exit.

## Constraints

- Use a dictionary where keys are contact names (lowercase for case-insensitive lookup) and values are dictionaries with `phone` and `email` keys.
- Handle case-insensitive name lookups.
- Validate that a contact exists before updating or deleting.
