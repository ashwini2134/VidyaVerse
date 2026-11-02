# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
def main():
    plate = input("Plate: ")
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")


def is_valid(s):
    # 2 to 6 characters, alphanumeric only
    if not (2 <= len(s) <= 6):
        return False
    if not s.isalnum():
        return False
    # Must start with at least two letters
    if not s[:2].isalpha():
        return False
    # Numbers must come only at the end; first number cannot be 0
    seen_number = False
    for c in s:
        if c.isdigit():
            if not seen_number and c == "0":
                return False
            seen_number = True
        elif seen_number:
            # a letter appeared after a number
            return False
    return True


main()
