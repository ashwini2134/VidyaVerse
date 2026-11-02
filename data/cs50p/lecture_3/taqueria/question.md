# Felipe's Taqueria

One of the most popular places to eat in town is Felipe's Taqueria, which offers a menu of entrees, wherein the value of each key is a price in dollars:

```python
{
    "Baja Taco": 4.25,
    "Burrito": 7.50,
    "Bowl": 8.50,
    "Nachos": 11.00,
    "Quesadilla": 8.50,
    "Super Burrito": 8.50,
    "Super Quesadilla": 9.50,
    "Taco": 3.00,
    "Tortilla Salad": 8.00
}
```

In a file called `taqueria.py`, implement a program that enables a user to place an order, prompting them for items, one per line, until the user inputs control-d (EOF). After each inputted item, display the total cost of all items inputted thus far, prefixed with a dollar sign (`$`) and formatted to two decimal places. Treat the user's input case-insensitively. Ignore any input that isn't an item.

## How to Test

- `Taco`, `Taco` → `Total: $3.00`, then `Total: $6.00`
- `Baja Taco`, `Tortilla Salad` → `Total: $4.25`, then `Total: $12.25`
- `Burger` → reprompt

```
check50 cs50/problems/2022/python/taqueria
```
