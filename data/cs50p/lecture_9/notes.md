# Lecture 9

> Source: [CS50P 2022 — Lecture 9](https://cs50.harvard.edu/python/2022/notes/9/#et-cetera)

## Et Cetera

- Over the many past lessons, we have covered so much related to Python!
- In this lesson, we will be focusing upon many of the "et cetera" items not previously discussed. "Et cetera" literally means "and the rest"!

## set

- In math, a set is a collection of values without any duplicates.

```python
students = [
    {"name": "Hermione", "house": "Gryffindor"},
    {"name": "Harry", "house": "Gryffindor"},
    {"name": "Ron", "house": "Gryffindor"},
    {"name": "Draco", "house": "Slytherin"},
    {"name": "Padma", "house": "Ravenclaw"},
]

houses = set()
for student in students:
    houses.add(student["house"])

for house in sorted(houses):
    print(house)
```

  The `set` object takes care of eliminating duplicates for us automatically.

- You can learn more in Python's documentation of [`set`](https://docs.python.org/3/library/stdtypes.html#set).

## Global Variables

- We can leverage global variables within Python. To interact with a global variable inside a function, use the `global` keyword:

```python
balance = 0


def main():
    print("Balance:", balance)
    deposit(100)
    withdraw(50)
    print("Balance:", balance)


def deposit(n):
    global balance
    balance += n


def withdraw(n):
    global balance
    balance -= n


if __name__ == "__main__":
    main()
```

- Utilizing object-oriented programming, we can use a class instead of a global variable:

```python
class Account:
    def __init__(self):
        self._balance = 0

    @property
    def balance(self):
        return self._balance

    def deposit(self, n):
        self._balance += n

    def withdraw(self, n):
        self._balance -= n


def main():
    account = Account()
    print("Balance:", account.balance)
    account.deposit(100)
    account.withdraw(50)
    print("Balance:", account.balance)


if __name__ == "__main__":
    main()
```

  Generally speaking, global variables should be used quite sparingly, if at all!

## Constants

- Some languages allow you to create unchangeable variables, called "constants". Python actually has no mechanism to prevent us from changing a value. Instead, you're on the honor system: if a variable name is written in all caps, just don't change it!

```python
class Cat:
    MEOWS = 3

    def meow(self):
        for _ in range(Cat.MEOWS):
            print("meow")


cat = Cat()
cat.meow()
```

## Type Hints

- `mypy` is a program that can help you test to make sure all your variables are of the right type. A type hint can be added to give Python a hint of what type a function should expect:

```python
def meow(n: int):
    for _ in range(n):
        print("meow")


number: int = int(input("Number: "))
meow(number)
```

- We can also annotate the return values of functions:

```python
def meow(n: int) -> str:
    return "meow\n" * n


number: int = int(input("Number: "))
meows: str = meow(number)
print(meows, end="")
```

- You can learn more in Python's documentation of [Type Hints](https://docs.python.org/3/library/typing.html) and about [`mypy`](https://mypy.readthedocs.io/).

## Docstrings

- A standard way of commenting your function's purpose is to use a docstring:

```python
def meow(n):
    """
    Meow n times.

    :param n: Number of times to meow
    :type n: int
    :raise TypeError: If n is not an int
    :return: A string of n meows, one per line
    :rtype: str
    """
    return "meow\n" * n


number = int(input("Number: "))
meows = meow(number)
print(meows, end="")
```

- You can learn more in Python's documentation of [docstrings](https://peps.python.org/pep-0257/).

## argparse

- `argparse` is a library that handles all the parsing of complicated command-line arguments:

```python
import argparse

parser = argparse.ArgumentParser(description="Meow like a cat")
parser.add_argument("-n", default=1, help="number of times to meow", type=int)
args = parser.parse_args()

for _ in range(args.n):
    print("meow")
```

  Not only is help documentation included, but you can provide a `default` value when no arguments are provided.

- You can learn more in Python's documentation of [`argparse`](https://docs.python.org/3/library/argparse.html).

## Unpacking

- You can unpack a sequence into a function's arguments using `*`:

```python
def total(galleons, sickles, knuts):
    return (galleons * 17 + sickles) * 29 + knuts


coins = [100, 50, 25]

print(total(*coins), "Knuts")
```

- And you can unpack a dictionary using `**`:

```python
def total(galleons, sickles, knuts):
    return (galleons * 17 + sickles) * 29 + knuts


coins = {"galleons": 100, "sickles": 50, "knuts": 25}

print(total(**coins), "Knuts")
```

## args and kwargs

- We can tell a function to expect an unknown number of positional arguments (`*args`) and keyword arguments (`**kwargs`):

```python
def f(*args, **kwargs):
    print("Positional:", args)
    print("Named:", kwargs)


f(100, 50, 25)
f(galleons=100, sickles=50, knuts=25)
```

  `args` are positional arguments; `kwargs` are named ("keyword") arguments.

## map

- `map` allows you to map a function to a sequence of values:

```python
def main():
    yell("This", "is", "CS50")


def yell(*words):
    uppercased = map(str.upper, words)
    print(*uppercased)


if __name__ == "__main__":
    main()
```

  `map` takes a function to apply to every element, and the list itself.

## List Comprehensions

- List comprehensions allow you to create a list on the fly in one elegant one-liner:

```python
students = [
    {"name": "Hermione", "house": "Gryffindor"},
    {"name": "Harry", "house": "Gryffindor"},
    {"name": "Ron", "house": "Gryffindor"},
    {"name": "Draco", "house": "Slytherin"},
]

gryffindors = [
    student["name"] for student in students if student["house"] == "Gryffindor"
]

for gryffindor in sorted(gryffindors):
    print(gryffindor)
```

## filter

- `filter` returns a subset of a sequence for which a certain condition is true:

```python
students = [
    {"name": "Hermione", "house": "Gryffindor"},
    {"name": "Harry", "house": "Gryffindor"},
    {"name": "Ron", "house": "Gryffindor"},
    {"name": "Draco", "house": "Slytherin"},
]

gryffindors = filter(lambda s: s["house"] == "Gryffindor", students)

for gryffindor in sorted(gryffindors, key=lambda s: s["name"]):
    print(gryffindor["name"])
```

- You can learn more in Python's documentation of [`filter`](https://docs.python.org/3/library/functions.html#filter).

## Dictionary Comprehensions

- We can apply the same idea behind list comprehensions to dictionaries:

```python
students = ["Hermione", "Harry", "Ron"]

gryffindors = {student: "Gryffindor" for student in students}

print(gryffindors)
```

## enumerate

- `enumerate` presents the index and the value of each element:

```python
students = ["Hermione", "Harry", "Ron"]

for i, student in enumerate(students):
    print(i + 1, student)
```

- You can learn more in Python's documentation of [`enumerate`](https://docs.python.org/3/library/functions.html#enumerate).

## Generators and Iterators

- In Python, there is a way to protect against your system running out of resources when problems become too large. The `yield` generator can return a small bit of the results at a time:

```python
def main():
    n = int(input("What's n? "))
    for s in sheep(n):
        print(s)


def sheep(n):
    for i in range(n):
        yield "🐑" * i


if __name__ == "__main__":
    main()
```

  `yield` provides only one value at a time while the `for` loop keeps working.

- You can learn more in Python's documentation of [generators](https://docs.python.org/3/howto/functional.html#generators) and [iterators](https://docs.python.org/3/howto/functional.html#iterators).

## Final Project

This was the final lecture of CS50P! Once you've worked through these notes, it's time to implement your own project, a Python program of your very own. Per CS50's requirements, your project must:

- Be implemented in Python.
- Have a `main` function and three or more additional functions, at least three of which are accompanied by tests that can be executed with `pytest`.
- Your `main` function and your custom functions must be in a file called `project.py` in the root of your project; your tests must be in `test_project.py`.
- List any `pip`-installable libraries your project requires in `requirements.txt`.

See [the project specification](https://cs50.harvard.edu/python/2022/project/) for full details.

## This was CS50!

Our great hope is that you will use what you learned in this course to address real problems in the world. This was CS50!
