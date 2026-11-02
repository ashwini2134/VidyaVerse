# NUMB3RS

An IPv4 address is a numeric identifier typically formatted in dot-decimal notation as `#.#.#.#`, but each `#` should be a number between `0` and `255`, inclusive.

In a file called `numb3rs.py`, implement a function called `validate` that expects an IPv4 address as input as a `str` and then returns `True` or `False`, respectively, if that input is a valid IPv4 address or not.

```python
import re
import sys


def main():
    print(validate(input("IPv4 Address: ")))


def validate(ip):
    ...


if __name__ == "__main__":
    main()
```

CS50 also asks you to implement `test_numb3rs.py` with two or more `test_` functions.

## How to Test

- `127.0.0.1` → `True`
- `255.255.255.255` → `True`
- `512.512.512.512` → `False`
- `1.2.3.1000` → `False`
- `cat` → `False`

```
check50 cs50/problems/2022/python/numb3rs
```
