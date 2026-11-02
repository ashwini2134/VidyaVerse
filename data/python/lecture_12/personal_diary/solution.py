import os

FILE_NAME = "diary.txt"
SEPARATOR = "===ENTRY==="

def load_entries():
    if not os.path.exists(FILE_NAME):
        return []
    with open(FILE_NAME, "r") as f:
        content = f.read().strip()
    if not content:
        return []
    blocks = content.split(SEPARATOR)
    entries = []
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        lines = block.split("\n")
        date = lines[0] if len(lines) > 0 else ""
        title = lines[1] if len(lines) > 1 else ""
        content_text = "\n".join(lines[2:]) if len(lines) > 2 else ""
        entries.append({"date": date, "title": title, "content": content_text})
    return entries

def save_entries(entries):
    with open(FILE_NAME, "w") as f:
        for e in entries:
            f.write(f"{SEPARATOR}\n{e['date']}\n{e['title']}\n{e['content']}\n")

while True:
    print("\n--- Personal Diary ---")
    print("1. Write a new entry")
    print("2. View all entries")
    print("3. Search entries by date")
    print("4. Search entries by keyword")
    print("5. Delete an entry")
    print("6. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        date = input("Date: ")
        title = input("Title: ")
        print("Content (end with 'END' on a line by itself):")
        lines = []
        while True:
            line = input()
            if line.strip() == "END":
                break
            lines.append(line)
        content = "\n".join(lines)
        with open(FILE_NAME, "a") as f:
            f.write(f"{SEPARATOR}\n{date}\n{title}\n{content}\n")
        print("Entry saved.")

    elif choice == "2":
        entries = load_entries()
        if not entries:
            print("No entries yet.")
        else:
            for e in entries:
                print(f"\n[{e['date']}] {e['title']}")
                print(e['content'])
                print("---")

    elif choice == "3":
        search_date = input("Enter date (YYYY-MM-DD): ")
        entries = load_entries()
        found = [e for e in entries if e['date'] == search_date]
        if not found:
            print("No entries found for that date.")
        else:
            for e in found:
                print(f"\n[{e['date']}] {e['title']}")
                print(e['content'])
                print("---")

    elif choice == "4":
        keyword = input("Enter keyword: ").lower()
        entries = load_entries()
        found = [e for e in entries if keyword in e['title'].lower() or keyword in e['content'].lower()]
        if not found:
            print("No entries found with that keyword.")
        else:
            for e in found:
                print(f"\n[{e['date']}] {e['title']}")
                print(e['content'])
                print("---")

    elif choice == "5":
        entries = load_entries()
        if not entries:
            print("No entries to delete.")
        else:
            for i, e in enumerate(entries, 1):
                print(f"{i}. [{e['date']}] {e['title']}")
            num = int(input("Enter number to delete: "))
            removed = entries.pop(num - 1)
            save_entries(entries)
            print(f"Entry '{removed['title']}' deleted.")

    elif choice == "6":
        print("Goodbye!")
        break

    else:
        print("Invalid choice.")
