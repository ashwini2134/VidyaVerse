# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
import inflect

names = []
while True:
    try:
        names.append(input("Name: "))
    except EOFError:
        break

p = inflect.engine()
print("Adieu, adieu, to " + p.join(names))
