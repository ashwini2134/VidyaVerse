# Hints

1. Start with an empty dictionary: `contacts = {}`.
2. Use the lowercase version of the name as the key for case-insensitive lookup: `contacts[name.lower()] = {...}`.
3. Store each contact as a nested dictionary: `{"name": "...", "phone": "...", "email": "..."}`.
4. Use `sorted(contacts.keys())` to display contacts alphabetically.
5. Check existence with `if name in contacts` before updating or deleting.
