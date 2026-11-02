size = int(input("Enter the table size: "))

for i in range(1, size + 1):
    print(f"{i:4}", end="")
    for j in range(1, size + 1):
        print(f"{i * j:4}", end="")
    print()
