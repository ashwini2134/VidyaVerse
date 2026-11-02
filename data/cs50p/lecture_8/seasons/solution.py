import sys
from datetime import date

import inflect


def main():
    birth = get_birth(input("Date of Birth: "))
    minutes = (date.today() - birth).days * 24 * 60
    p = inflect.engine()
    words = p.number_to_words(minutes, andword="").capitalize()
    print(f"{words} minutes")


def get_birth(s):
    try:
        return date.fromisoformat(s.strip())
    except ValueError:
        sys.exit("Invalid date")


if __name__ == "__main__":
    main()
