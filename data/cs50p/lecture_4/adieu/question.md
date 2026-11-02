# Adieu, Adieu

In *The Sound of Music*, there's a song with the line "Adieu, adieu, to yieu and yieu and yieu".

In a file called `adieu.py`, implement a program that prompts the user for names, one per line, until the user inputs control-d (EOF). Assume that the user will input at least one name. Then bid adieu to those names, separating two names with one `and`, three names with two commas and one `and`, and n names with n−1 commas and one `and` (an Oxford comma), as in:

```
Adieu, adieu, to Liesl
Adieu, adieu, to Liesl and Friedrich
Adieu, adieu, to Liesl, Friedrich, and Louisa
```

> Uses the third-party `inflect` module (`pip install inflect`).

## How to Test

- `Liesl`, `^D` → `Adieu, adieu, to Liesl`
- `Liesl`, `Friedrich`, `^D` → `Adieu, adieu, to Liesl and Friedrich`
- `Liesl`, `Friedrich`, `Louisa`, `^D` → `Adieu, adieu, to Liesl, Friedrich, and Louisa`

```
check50 cs50/problems/2022/python/adieu
```
