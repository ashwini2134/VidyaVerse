import re


def main():
    print(convert(input("Hours: ")))


def convert(s):
    pattern = r"^(\d{1,2})(?::([0-5][0-9]))? (AM|PM) to (\d{1,2})(?::([0-5][0-9]))? (AM|PM)$"
    match = re.search(pattern, s)
    if not match:
        raise ValueError("Invalid format")

    h1, m1, p1, h2, m2, p2 = match.groups()
    start = to_24(h1, m1 or "00", p1)
    end = to_24(h2, m2 or "00", p2)
    return f"{start} to {end}"


def to_24(hour, minute, period):
    hour = int(hour)
    if not 1 <= hour <= 12:
        raise ValueError("Invalid hour")
    if period == "AM":
        if hour == 12:
            hour = 0
    else:  # PM
        if hour != 12:
            hour += 12
    return f"{hour:02}:{minute}"


if __name__ == "__main__":
    main()
