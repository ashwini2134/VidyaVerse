text = input("Input: ")
result = ""
for c in text:
    if c not in "AEIOUaeiou":
        result += c
print(result)
