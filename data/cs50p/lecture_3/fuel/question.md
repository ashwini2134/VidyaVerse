# Fuel Gauge

Fuel gauges indicate, often with fractions, just how much fuel is in a tank. For instance 1/4 indicates that a tank is 25% full, 1/2 indicates 50% full, and 3/4 indicates 75% full.

In a file called `fuel.py`, implement a program that prompts the user for a fraction, formatted as `X/Y`, wherein each of `X` and `Y` is an integer, and then outputs, as a percentage rounded to the nearest integer, how much fuel is in the tank. If 1% or less remains, output `E` to indicate that the tank is essentially empty. If 99% or more remains, output `F` to indicate that the tank is essentially full.

If `X` or `Y` is not an integer, `X` is greater than `Y`, or `Y` is `0`, instead prompt the user again. Be sure to catch any exceptions like `ValueError` or `ZeroDivisionError`.

## How to Test

- `3/4` → `75%`
- `1/4` → `25%`
- `4/4` → `F`
- `0/4` → `E`
- `4/0` → reprompt (ZeroDivisionError)
- `three/four` → reprompt (ValueError)
- `5/4` → reprompt

```
check50 cs50/problems/2022/python/fuel
```
