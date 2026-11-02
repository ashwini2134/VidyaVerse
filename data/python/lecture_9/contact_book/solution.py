contacts = {}

while True:
    print("\n--- Contact Book ---")
    print("1. Add contact")
    print("2. View all contacts")
    print("3. Search by name")
    print("4. Update phone")
    print("5. Delete contact")
    print("6. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        name = input("Enter name: ")
        phone = input("Enter phone: ")
        email = input("Enter email: ")
        contacts[name.lower()] = {"name": name, "phone": phone, "email": email}
        print(f'Contact "{name}" added.')

    elif choice == "2":
        if not contacts:
            print("Contact book is empty.")
        else:
            for key in sorted(contacts.keys()):
                c = contacts[key]
                print(f'{c["name"]} — {c["phone"]} — {c["email"]}')

    elif choice == "3":
        name = input("Enter name to search: ").lower()
        if name in contacts:
            c = contacts[name]
            print(f"Name: {c['name']}")
            print(f"Phone: {c['phone']}")
            print(f"Email: {c['email']}")
        else:
            print("Contact not found.")

    elif choice == "4":
        name = input("Enter name to update: ").lower()
        if name in contacts:
            contacts[name]["phone"] = input("Enter new phone: ")
            print("Phone number updated.")
        else:
            print("Contact not found.")

    elif choice == "5":
        name = input("Enter name to delete: ").lower()
        if name in contacts:
            del contacts[name]
            print("Contact deleted.")
        else:
            print("Contact not found.")

    elif choice == "6":
        print("Goodbye!")
        break

    else:
        print("Invalid choice.")
