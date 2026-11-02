# Meal Time

Suppose that you're in a country where it's customary to eat breakfast between 7:00 and 8:00, lunch between 12:00 and 13:00, and dinner between 18:00 and 19:00. Wouldn't it be nice if you had a program that could tell you what to eat when?

In `meal.py`, implement a program that prompts the user for a time and outputs whether it's `breakfast time`, `lunch time`, or `dinner time`. If it's not time for a meal, don't output anything at all. Assume that the user's input will be formatted in 24-hour time as `#:##` or `##:##`. And assume that each meal's time range is inclusive.

Structure your program per the below, wherein `convert` is a function (that can be called by `main`) that converts `time`, a `str` in 24-hour format, to the corresponding number of hours as a `float`. For instance, given a `time` like `"7:30"` (i.e., 7 hours and 30 minutes), `convert` should return `7.5` (i.e., 7.5 hours).

```python
def main():
    ...


def convert(time):
    ...


if __name__ == "__main__":
    main()
```

## How to Test

- Run your program with `python meal.py`. Type `7:00`. Your program should output `breakfast time`.
- Type `12:42`. Your program should output `lunch time`.
- Type `18:32`. Your program should output `dinner time`.
- Type `11:11`. Your program should output nothing.

```
check50 cs50/problems/2022/python/meal
```
