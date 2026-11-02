# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
def convert(text):
    return text.replace(":)", "🙂").replace(":(", "🙁")


def main():
    print(convert(input("Input: ")))


main()
