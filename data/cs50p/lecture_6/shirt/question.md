# CS50 P-Shirt

After finishing CS50, students traditionally receive their very own "I took CS50" t-shirt. Like to try one on virtually?

In a file called `shirt.py`, implement a program that expects exactly two command-line arguments:

- in `sys.argv[1]`, the name (or path) of a JPEG or PNG to read (i.e., open) as input
- in `sys.argv[2]`, the name (or path) of a JPEG or PNG to write (i.e., save) as output

The program should overlay `shirt.png` (which has a transparent background) on the input after resizing and cropping the input to be the same size, saving the result as its output. Use `Image.open`, `ImageOps.fit` (with default `method`, `bleed`, and `centering`), `Image.paste`, and `Image.save` from Pillow (`pip install Pillow`).

The program should instead exit via `sys.exit`:

- if the user does not specify exactly two command-line arguments,
- if the input's and output's names do not end in `.jpg`, `.jpeg`, or `.png`, case-insensitively,
- if the input's name does not have the same extension as the output's name, or
- if the specified input does not exist.

## How to Test

- `python shirt.py` → exits: `Too few command-line arguments`
- `python shirt.py a.jpg b.jpg c.jpg` → exits: `Too many command-line arguments`
- `python shirt.py before1.jpg out.bmp` → exits: `Invalid output`
- `python shirt.py before1.jpg after1.png` → exits: `Input and output have different extensions`
- `python shirt.py missing.jpg after1.jpg` → exits: `Input does not exist`
- `python shirt.py before1.jpg after1.jpg` → saves the shirt overlay

```
check50 cs50/problems/2022/python/shirt
```
