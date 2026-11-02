import sys
from os.path import splitext

from PIL import Image, ImageOps


def main():
    if len(sys.argv) < 3:
        sys.exit("Too few command-line arguments")
    if len(sys.argv) > 3:
        sys.exit("Too many command-line arguments")

    allowed = [".jpg", ".jpeg", ".png"]
    in_ext = splitext(sys.argv[1])[1].lower()
    out_ext = splitext(sys.argv[2])[1].lower()

    if in_ext not in allowed:
        sys.exit("Invalid input")
    if out_ext not in allowed:
        sys.exit("Invalid output")
    if in_ext != out_ext:
        sys.exit("Input and output have different extensions")

    try:
        photo = Image.open(sys.argv[1])
    except FileNotFoundError:
        sys.exit("Input does not exist")

    shirt = Image.open("shirt.png")
    photo = ImageOps.fit(photo, shirt.size)
    photo.paste(shirt, shirt)
    photo.save(sys.argv[2])


if __name__ == "__main__":
    main()
