# CS50 Shirtificate

Suppose that you'd like to implement a CS50 "shirtificate," a PDF with an image of an "I took CS50" t-shirt customized with a user's own name.

In a file called `shirtificate.py`, implement a program that prompts the user for their name and outputs, using `fpdf2`, a CS50 shirtificate in a file called `shirtificate.pdf`, with these specifications:

- The orientation of the PDF should be Portrait.
- The format of the PDF should be A4, which is 210mm wide by 297mm tall.
- The top of the PDF should say "CS50 Shirtificate" as text, centered horizontally.
- The shirt's image (`shirtificate.png`) should be centered horizontally.
- The user's name should be on top of the shirt, in white text.

(Uses the third-party `fpdf2` module: `pip install fpdf2`.)

## How to Test

- `Name: <your name>` → creates `shirtificate.pdf` with the name overlaid on a rendering of `shirtificate.png`.

```
check50 cs50/problems/2022/python/shirtificate
```
