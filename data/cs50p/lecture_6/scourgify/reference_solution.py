# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
import csv
import sys


def main():
    if len(sys.argv) < 3:
        sys.exit("Too few command-line arguments")
    if len(sys.argv) > 3:
        sys.exit("Too many command-line arguments")

    try:
        with open(sys.argv[1]) as infile:
            reader = csv.DictReader(infile)
            rows = list(reader)
    except FileNotFoundError:
        sys.exit(f"Could not read {sys.argv[1]}")

    with open(sys.argv[2], "w", newline="") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=["first", "last", "house"])
        writer.writeheader()
        for row in rows:
            last, first = row["name"].split(", ")
            writer.writerow({"first": first, "last": last, "house": row["house"]})


if __name__ == "__main__":
    main()
