items = []

while True:
    print("\n--- Shopping List Manager ---")
    print("1. Add item")
    print("2. Remove item")
    print("3. View list")
    print("4. Mark as purchased")
    print("5. Clear purchased items")
    print("6. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        name = input("Enter item name: ")
        items.append({"name": name, "purchased": False})
        print(f'"{name}" added to the list.')

    elif choice == "2":
        for i, item in enumerate(items, 1):
            print(f"{i}. {item['name']}")
        num = int(input("Enter number to remove: "))
        removed = items.pop(num - 1)
        print(f'"{removed["name"]}" removed.')

    elif choice == "3":
        if not items:
            print("Your list is empty.")
        else:
            print("Your shopping list:")
            for i, item in enumerate(items, 1):
                status = "[x]" if item["purchased"] else "[ ]"
                print(f"{i}. {status} {item['name']}")

    elif choice == "4":
        for i, item in enumerate(items, 1):
            status = "[x]" if item["purchased"] else "[ ]"
            print(f"{i}. {status} {item['name']}")
        num = int(input("Enter number to mark as purchased: "))
        items[num - 1]["purchased"] = True
        print(f'"{items[num - 1]["name"]}" marked as purchased.')

    elif choice == "5":
        before = len(items)
        items = [item for item in items if not item["purchased"]]
        print(f"Cleared {before - len(items)} purchased items.")

    elif choice == "6":
        print("Goodbye!")
        break

    else:
        print("Invalid choice. Please enter 1-6.")
