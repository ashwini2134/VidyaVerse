# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
import validators


def main():
    email = input("Email: ")
    if validators.email(email):
        print("Valid")
    else:
        print("Invalid")


if __name__ == "__main__":
    main()
