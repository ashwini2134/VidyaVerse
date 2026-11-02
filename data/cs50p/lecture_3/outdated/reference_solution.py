# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
def main():
    months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ]
    while True:
        try:
            date = input("Date: ").strip()
            if "/" in date:
                month, day, year = date.split("/")
                month, day, year = int(month), int(day), int(year)
                if not (1 <= month <= 12 and 1 <= day <= 31):
                    continue
            elif "," in date:
                month_str, day, year = date.replace(",", "").split()
                if month_str not in months:
                    continue
                month = months.index(month_str) + 1
                day, year = int(day), int(year)
                if not (1 <= day <= 31):
                    continue
            else:
                continue
            print(f"{year}-{month:02}-{day:02}")
            break
        except ValueError:
            continue


if __name__ == "__main__":
    main()
