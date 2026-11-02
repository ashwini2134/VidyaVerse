# Lecture 1

> Source: [CS50P 2022 — Lecture 1](https://cs50.harvard.edu/python/2022/notes/1/#conditionals)

## Conditionals

- Conditionals allow you, the programmer, to allow your program to make decisions: as if your program has the choice between taking the left-hand road or the right-hand road based upon certain conditions.
- Built within Python are a set of "operators" that are used to ask mathematical questions.
- `>` and `<` symbols are probably quite familiar to you.
- `>=` denotes "greater than or equal to."
- `<=` denotes "less than or equal to."
- `==` denotes "equals" — do notice the double equal sign! A single equal sign would assign a value. Double equal signs are used to compare variables.
- `!=` denotes "not equal to."
- Conditional statements compare a left-hand term to a right-hand term.

## if Statements

- In your terminal window, type `code compare.py`. In the text editor window, begin with the following:

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
```

  Your program takes the input of the user for both x and y, casting them as integers. Then, the `if` statement compares x and y. If the condition `x < y` is met, the `print` statement is executed.

- `if` statements use `bool` or boolean values (true or false) to decide whether or not to execute.

## Control Flow, elif, and else

- Further revise your code as follows:

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
if x > y:
    print("x is greater than y")
if x == y:
    print("x is equal to y")
```

  This flow of decisions is called "control flow."

- This program can be improved by not asking three consecutive questions. After all, not all three questions can have an outcome of `true`:

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
elif x > y:
    print("x is greater than y")
elif x == y:
    print("x is equal to y")
```

  The use of `elif` allows the program to make fewer decisions.

- We can create a "catch-all" default outcome using an `else` statement:

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
elif x > y:
    print("x is greater than y")
else:
    print("x is equal to y")
```

## or

- `or` allows your program to decide between one or more alternatives:

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y or x > y:
    print("x is not equal to y")
else:
    print("x is equal to y")
```

- We could further edit our code to ask one and only one question:

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x != y:
    print("x is not equal to y")
else:
    print("x is equal to y")
```

- For the purpose of illustration:

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x == y:
    print("x is equal to y")
else:
    print("x is not equal to y")
```

  Notice that the `==` operator evaluates if what is on the left and right are equal to one another. The use of double equal signs is very important.

## and

- Similar to `or`, `and` can be used within conditional statements.
- Execute in the terminal window `code grade.py`. Start your new program as follows:

```python
score = int(input("Score: "))

if score >= 90 and score <= 100:
    print("Grade: A")
elif score >= 80 and score < 90:
    print("Grade: B")
elif score >= 70 and score < 80:
    print("Grade: C")
elif score >= 60 and score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

- Python allows you to chain together the operators and conditions in a way quite uncommon to other programming languages:

```python
score = int(input("Score: "))

if 90 <= score <= 100:
    print("Grade: A")
elif 80 <= score < 90:
    print("Grade: B")
elif 70 <= score < 80:
    print("Grade: C")
elif 60 <= score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

- Still, we can further improve our program by asking fewer questions:

```python
score = int(input("Score: "))

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")
```

- You can learn more in Python's documentation on [control flow](https://docs.python.org/3/tutorial/controlflow.html).

## Modulo

- In mathematics, parity refers to whether a number is either even or odd.
- The modulo `%` operator in programming allows one to see if two numbers divide evenly or divide and have a remainder.
- For example, `4 % 2` would result in zero, because it evenly divides. However, `3 % 2` does not divide evenly and would result in a number other than zero.

```python
x = int(input("What's x? "))

if x % 2 == 0:
    print("Even")
else:
    print("Odd")
```

## Creating Our Own Parity Function

- We can create our own function to check whether a number is even or odd:

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False


main()
```

  Our function returns a `bool` (true or false) back to the main function. The `if` statement simply evaluates whether or not `is_even` of `x` is true or false.

## Pythonic

- There are ways to program that are sometimes only seen in Python programming. Consider the following revision:

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    return True if n % 2 == 0 else False


main()
```

- We can further revise our code and make it more and more readable:

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    return n % 2 == 0


main()
```

## match

- Similar to `if`, `elif`, and `else` statements, `match` statements can be used to conditionally run code that matches certain values.
- Consider the following program:

```python
name = input("What's your name? ")

if name == "Harry":
    print("Gryffindor")
elif name == "Hermione":
    print("Gryffindor")
elif name == "Ron":
    print("Gryffindor")
elif name == "Draco":
    print("Slytherin")
else:
    print("Who?")
```

- We can improve this code slightly with the use of the `or` keyword:

```python
name = input("What's your name? ")

if name == "Harry" or name == "Hermione" or name == "Ron":
    print("Gryffindor")
elif name == "Draco":
    print("Slytherin")
else:
    print("Who?")
```

- Alternatively, we can use `match` statements to map names to houses:

```python
name = input("What's your name? ")

match name:
    case "Harry":
        print("Gryffindor")
    case "Hermione":
        print("Gryffindor")
    case "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
    case _:
        print("Who?")
```

  The `_` symbol in the last case will match with any input, resulting in similar behavior as an `else` statement.

- We can improve the code using the single vertical bar `|`, which (much like the `or` keyword) allows us to check for multiple values in the same `case` statement:

```python
name = input("What's your name? ")

match name:
    case "Harry" | "Hermione" | "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
    case _:
        print("Who?")
```

## Summing Up

You now have the power within Python to use conditional statements to ask questions and have your program take action accordingly. In this lecture, we discussed…

- Conditionals
- `if` Statements
- Control flow, `elif`, and `else`
- `or`
- `and`
- Modulo
- Creating your own function
- Pythonic coding
- `match`
