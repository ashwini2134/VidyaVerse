# Lecture 3

> Source: [CS50P 2022 — Lecture 3](https://cs50.harvard.edu/python/2022/notes/3/#exceptions)

## Exceptions

- Exceptions are things that go wrong within our coding.
- In our text editor, type `code hello.py` and type the following (with the intentional error included):

```python
print("hello, world)
```

  Notice that we intentionally left out a quotation mark. Running `python hello.py`, an error is outputted. The compiler states that it is a "syntax error." Syntax errors are those that require you to double-check that you typed in your code correctly.

- You can learn more in Python's documentation of [Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html).

## Runtime Errors

- Runtime errors refer to those created by unexpected behavior within your code. For example, perhaps you intended for a user to input a number, but they input a character instead.

```python
x = int(input("What's x? "))
print(f"x is {x}")
```

- As programmers, we should be defensive to ensure that our users are entering what we expected. We might consider "corner cases" such as `-1`, `0`, or `cat`.
- If we run this program and type in "cat", we'll suddenly see `ValueError: invalid literal for int() with base 10: 'cat'`.
- An effective strategy to fix this potential error would be to create "error handling" to ensure the user behaves as we intend.

## try

- In Python `try` and `except` are ways of testing out user input before something goes wrong:

```python
try:
    x = int(input("What's x? "))
    print(f"x is {x}")
except ValueError:
    print("x is not an integer")
```

  Running this code, inputting `50` will be accepted. However, typing in `cat` will produce an error visible to the user.

- For best practice, we should only `try` the fewest lines of code possible that we are concerned could fail:

```python
try:
    x = int(input("What's x? "))
except ValueError:
    print("x is not an integer")

print(f"x is {x}")
```

  This now faces a new error! We face a `NameError` where `x is not defined`. If the assignment of `x` fails, there is no x to print on our final line of code.

## else

- It turns out that there is another way to implement `try` that could catch errors of this nature:

```python
try:
    x = int(input("What's x? "))
except ValueError:
    print("x is not an integer")
else:
    print(f"x is {x}")
```

  If no exception occurs, it will then run the block of code within `else`.

- Consider how we can use a loop to prompt the user for `x` and, if they don't cooperate, prompt again:

```python
while True:
    try:
        x = int(input("What's x? "))
    except ValueError:
        print("x is not an integer")
    else:
        break

print(f"x is {x}")
```

## Creating a Function to Get an Integer

- Surely, there are many times that we would want to get an integer from our user:

```python
def main():
    x = get_int()
    print(f"x is {x}")


def get_int():
    while True:
        try:
            x = int(input("What's x? "))
        except ValueError:
            print("x is not an integer")
        else:
            break
    return x


main()
```

- Even still, we can improve this program. `return` will not only break you out of a loop, but it will also return a value:

```python
def main():
    x = get_int()
    print(f"x is {x}")


def get_int():
    while True:
        try:
            return int(input("What's x? "))
        except ValueError:
            print("x is not an integer")


main()
```

## pass

- We can make it such that our code does not warn our user, but simply re-asks them our prompting question:

```python
def main():
    x = get_int()
    print(f"x is {x}")


def get_int():
    while True:
        try:
            return int(input("What's x? "))
        except ValueError:
            pass


main()
```

- One final refinement: we probably want to pass in a prompt that the user sees when asked for input:

```python
def main():
    x = get_int("What's x? ")
    print(f"x is {x}")


def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            pass


main()
```

- You can learn more in Python's documentation of [`pass`](https://docs.python.org/3/tutorial/controlflow.html#pass-statements).

## Summing Up

Errors are inevitable in your code. However, you have the opportunity to use what was learned today to help prevent these errors. In this lecture, you learned about…

- Exceptions
- Value Errors
- Runtime Errors
- `try`
- `else`
- `pass`
