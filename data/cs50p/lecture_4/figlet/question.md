# Frank, Ian and Glen's Letters

FIGlet is a program from the early 1990s for making large letters out of ordinary text (ASCII art). It has since been ported to Python as a module called `pyfiglet` (`pip install pyfiglet`).

In a file called `figlet.py`, implement a program that:

- Expects zero or two command-line arguments:
  - Zero if the user would like to output text in a random font.
  - Two if the user would like a specific font, in which case the first should be `-f` or `--font`, and the second should be the name of the font.
- Prompts the user for a `str` of text.
- Outputs that text in the desired font.

If the user provides two command-line arguments and the first is not `-f`/`--font` or the second is not the name of a font, the program should exit via `sys.exit` with an error message.

Useful API:

```python
from pyfiglet import Figlet
figlet = Figlet()
figlet.getFonts()        # list of available fonts
figlet.setFont(font=f)   # set the font
print(figlet.renderText(s))
```

## How to Test

- `python figlet.py test` → exits with `Invalid usage`
- `python figlet.py -f invalid_font` → exits with `Invalid usage`
- `python figlet.py -f slant` then type `CS50` → prints `CS50` in the slant font

```
check50 cs50/problems/2022/python/figlet
```
