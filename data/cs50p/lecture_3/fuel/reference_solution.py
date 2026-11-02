# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
def main():
    percentage = get_fuel()
    if percentage <= 1:
        print("E")
    elif percentage >= 99:
        print("F")
    else:
        print(f"{percentage}%")


def get_fuel():
    while True:
        try:
            x, y = input("Fraction: ").split("/")
            x, y = int(x), int(y)
            if x > y:
                continue
            return round(x / y * 100)
        except (ValueError, ZeroDivisionError):
            pass


if __name__ == "__main__":
    main()
