# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
def main():
    groceries = {}
    while True:
        try:
            item = input().strip().upper()
        except EOFError:
            break
        groceries[item] = groceries.get(item, 0) + 1
    for item in sorted(groceries):
        print(groceries[item], item)


if __name__ == "__main__":
    main()
