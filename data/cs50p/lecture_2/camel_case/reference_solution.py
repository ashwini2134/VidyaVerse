# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
name = input("camelCase: ")
result = ""
for c in name:
    if c.isupper():
        result += "_" + c.lower()
    else:
        result += c
print(result)
