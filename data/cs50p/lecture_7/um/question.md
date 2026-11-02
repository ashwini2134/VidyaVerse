# Regular, um, Expressions

It's not uncommon, in English, to say "um" when trying to, um, think of a word.

In a file called `um.py`, implement a function called `count` that expects a line of text as input as a `str` and returns, as an `int`, the number of times that "um" appears in that text, case-insensitively, as a word unto itself, not as a substring of some other word. For instance, given `hello, um, world`, the function should return `1`. Given `yummy`, it should return `0`.

CS50 also asks you to implement `test_um.py` with three or more `test_` functions.

## How to Test

- `um` → `1`
- `um?` → `1`
- `Um, thanks for the album.` → `1`
- `Um, thanks, um...` → `2`
- `yummy` → `0`

```
check50 cs50/problems/2022/python/um
```
