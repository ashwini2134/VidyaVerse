# Outdated

In the United States, dates are typically formatted in month-day-year order (MM/DD/YYYY), which is hard to sort and ambiguous. Computers tend to use ISO 8601, which prescribes year-month-day (YYYY-MM-DD) order, padding each value with leading zeroes as needed.

In a file called `outdated.py`, implement a program that prompts the user for a date, in month-day-year order, formatted like `9/8/1636` or `September 8, 1636`, wherein the month in the latter might be any of:

```
January, February, March, April, May, June, July,
August, September, October, November, December
```

Then output that same date in `YYYY-MM-DD` format. If the user's input is not a valid date in either format, prompt the user again. Assume that every month has no more than 31 days.

## How to Test

- `9/8/1636` → `1636-09-08`
- `September 8, 1636` → `1636-09-08`
- `23/6/1912` → reprompt
- `December 80, 1980` → reprompt

```
check50 cs50/problems/2022/python/outdated
```
