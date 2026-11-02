# Seasons of Love

Assuming there are 365 days in a year, there are 525,600 minutes in that same year — but leap years complicate things, so let's use Python's `datetime` module instead of reinventing the wheel.

In a file called `seasons.py`, implement a program that prompts the user for their date of birth in `YYYY-MM-DD` format and then prints how old they are in minutes, rounded to the nearest integer, using English words instead of numerals, without any `and` between words (like the song from *Rent*). Assume the user was born at midnight (00:00:00) and that the current time is also midnight; use `datetime.date.today` to get today's date.

Structure your program with a `main` function and one or more other functions. Exit via `sys.exit` if the user does not input a date in `YYYY-MM-DD` format, and ensure your program will not raise any exceptions.

(Uses the third-party `inflect` module. CS50 also asks you to implement `test_seasons.py`.)

## How to Test

- a date one year ago → `Five hundred twenty-five thousand, six hundred minutes`
- a date two years ago → `One million, fifty-one thousand, two hundred minutes`
- an invalid format → exits via `sys.exit`

```
check50 cs50/problems/2022/python/seasons
```
