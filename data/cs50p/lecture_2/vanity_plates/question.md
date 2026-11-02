# Vanity Plates

In Massachusetts, it's possible to request a vanity license plate for your car, with your choice of letters and numbers instead of random ones. Among the requirements, though, are:

- All vanity plates must start with at least two letters.
- Vanity plates may contain a maximum of 6 characters (letters or numbers) and a minimum of 2 characters.
- Numbers cannot be used in the middle of a plate; they must come at the end. For example, `AAA222` would be an acceptable vanity plate; `AAA22A` would not be acceptable. The first number used cannot be a `0`.
- No periods, spaces, or punctuation marks are allowed.

In `plates.py`, implement a program that prompts the user for a vanity plate and then outputs `Valid` if it meets all of the requirements or `Invalid` if it does not. Assume that any letters in the user's input will be uppercase. Structure your program per the below, wherein `is_valid` returns `True` if `s` meets all requirements and `False` if it does not.

```python
def main():
    plate = input("Plate: ")
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")


def is_valid(s):
    ...


main()
```

## How to Test

- `CS50` → `Valid`
- `CS05` → `Invalid`
- `CS50P` → `Invalid`
- `PI3.14` → `Invalid`
- `H` → `Invalid`
- `OUTATIME` → `Invalid`

```
check50 cs50/problems/2022/python/plates
```
