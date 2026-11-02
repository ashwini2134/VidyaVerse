# Working 9 to 5

The United States tends to use a 12-hour clock (e.g. `9:00 AM to 5:00 PM`).

In a file called `working.py`, implement a function called `convert` that expects a `str` in any of the 12-hour formats below and returns the corresponding `str` in 24-hour format (e.g. `09:00 to 17:00`). Expect that `AM` and `PM` will be capitalized (with no periods) and that there will be a space before each. Raise a `ValueError` if the input is not in one of these formats or if either time is invalid (e.g. `12:60 AM`, `13:00 PM`). Do not assume hours start AM and end PM.

- `9:00 AM to 5:00 PM`
- `9 AM to 5 PM`
- `9:00 AM to 5 PM`
- `9 AM to 5:00 PM`

CS50 also asks you to implement `test_working.py` with three or more `test_` functions.

## How to Test

- `9 AM to 5 PM` → `09:00 to 17:00`
- `10 AM to 8:50 PM` → `10:00 to 20:50`
- `10:30 PM to 8 AM` → `22:30 to 08:00`
- `9:60 AM to 5:60 PM` → raises `ValueError`
- `9 AM - 5 PM` → raises `ValueError`

```
check50 cs50/problems/2022/python/working
```
