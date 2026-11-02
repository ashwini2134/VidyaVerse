# Lecture 2

> Source: [CS50P 2022 — Lecture 2](https://cs50.harvard.edu/python/2022/notes/2/#loops)

## Loops

- Essentially, loops are a way to do something over and over again.
- In developing as a programmer, you want to consider how one could improve areas of one's code where one types the same thing over and over again. Imagine where one might want to "meow" 500 times. Would it be logical to type that same expression of `print("meow")` over and over again?
- Loops enable you to create a block of code that executes over and over again.

## While Loops

- The `while` loop is nearly universal throughout all coding languages.
- In the text editor window, edit your code as follows:

```python
i = 3
while i != 0:
    print("meow")
```

  Even though this code will execute `print("meow")` multiple times, it will never stop! It will loop forever. When you get stuck in a loop that executes forever, you can press `control-c` on your keyboard to break out of the loop.

- To fix this loop, we can edit our code as follows:

```python
i = 3
while i != 0:
    print("meow")
    i = i - 1
```

  Now our code executes properly, reducing `i` by `1` for each "iteration" through the loop.

- It's best practice in programming to begin counting with zero:

```python
i = 0
while i < 3:
    print("meow")
    i += 1
```

  Notice how `i += 1` is the same as saying `i = i + 1`.

## For Loops

- A `for` loop is a different type of loop. To best understand a `for` loop, it's best to begin by talking about a new variable type called a `list` in Python.
- A `for` loop iterates through a `list` of items:

```python
for i in [0, 1, 2]:
    print("meow")
```

- What if you wanted to iterate up to a million? It's best to create code that can work with such extreme cases:

```python
for i in range(3):
    print("meow")
```

  `range(3)` provides back three values (`0`, `1`, and `2`) automatically.

- Notice how we never use `i` explicitly in our code. In Python, if such a variable does not have any other significance, we can simply represent this variable as a single underscore `_`:

```python
for _ in range(3):
    print("meow")
```

- Consider the following code:

```python
print("meow\n" * 3, end="")
```

  This code produces three meows, each on a separate line. By adding `end=""` and the `\n` we tell the compiler to add a line break at the end of each meow.

## Improving with User Input

- A common paradigm within Python is to use a `while` loop to validate the input of the user:

```python
while True:
    n = int(input("What's n? "))
    if n < 0:
        continue
    else:
        break
```

  We've introduced two new keywords, `continue` and `break`. `continue` explicitly tells Python to go to the next iteration of a loop. `break` tells Python to "break out" of a loop early.

- It turns out that the `continue` keyword is redundant in this case:

```python
while True:
    n = int(input("What's n? "))
    if n > 0:
        break

for _ in range(n):
    print("meow")
```

- Bringing in our prior learning, we can use functions to further improve our code:

```python
def main():
    meow(get_number())


def get_number():
    while True:
        n = int(input("What's n? "))
        if n > 0:
            return n


def meow(n):
    for _ in range(n):
        print("meow")


main()
```

## More About Lists

- In the text editor, code as follows:

```python
students = ["Hermione", "Harry", "Ron"]

print(students[0])
print(students[1])
print(students[2])
```

  We then print the student who is at the 0th location, "Hermione". Each of the other students is printed as well.

- Just as we illustrated previously, we can use a loop to iterate over the list:

```python
students = ["Hermione", "Harry", "Ron"]

for student in students:
    print(student)
```

- You can learn more in Python's documentation of [lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists).

## Length

- We can utilize `len` as a way of checking the length of the `list` called `students`:

```python
students = ["Hermione", "Harry", "Ron"]

for i in range(len(students)):
    print(i + 1, students[i])
```

  `len` allows you to dynamically see how long the list of students is regardless of how much it grows.

## Dictionaries

- `dict`s or dictionaries is a data structure that allows you to associate keys with values.
- Where a `list` is a list of multiple values, a `dict` associates a key with a value:

```python
students = {
    "Hermione": "Gryffindor",
    "Harry": "Gryffindor",
    "Ron": "Gryffindor",
    "Draco": "Slytherin",
}
print(students["Hermione"])
print(students["Harry"])
print(students["Ron"])
print(students["Draco"])
```

  We use `{}` curly braces to create a dictionary. Where `list`s use numbers to iterate, `dict`s allow us to use words.

- How could we print out both values and keys?

```python
students = {
    "Hermione": "Gryffindor",
    "Harry": "Gryffindor",
    "Ron": "Gryffindor",
    "Draco": "Slytherin",
}
for student in students:
    print(student, students[student], sep=", ")
```

- What if we have more information about our students? You can imagine wanting to have lots of data associated with multiple keys:

```python
students = [
    {"name": "Hermione", "house": "Gryffindor", "patronus": "Otter"},
    {"name": "Harry", "house": "Gryffindor", "patronus": "Stag"},
    {"name": "Ron", "house": "Gryffindor", "patronus": "Jack Russell terrier"},
    {"name": "Draco", "house": "Slytherin", "patronus": None},
]

for student in students:
    print(student["name"], student["house"], student["patronus"], sep=", ")
```

  This code creates a `list` of `dict`s. Python has a special `None` designation where there is no value associated with a key.

## Mario

- Remember that the classic game Mario has a hero jumping over bricks. Let's create a textual representation of this game.
- Consider how we could print a column:

```python
def main():
    print_column(3)


def print_column(height):
    for _ in range(height):
        print("#")


main()
```

- Now, let's try to print a row horizontally:

```python
def main():
    print_row(4)


def print_row(width):
    print("?" * width)


main()
```

- How could we implement both rows and columns within our code?

```python
def main():
    print_square(3)


def print_square(size):

    # For each row in square
    for i in range(size):

        # For each brick in row
        for j in range(size):

            #  Print brick
            print("#", end="")

        # Print blank line
        print()


main()
```

  We have an outer loop that addresses each row in the square. Then, we have an inner loop that prints a brick in each row. Finally, we have a `print` statement that prints a blank line.

- We can further abstract away our code:

```python
def main():
    print_square(3)


def print_square(size):
    for i in range(size):
        print_row(size)


def print_row(width):
    print("#" * width)


main()
```

## Summing Up

You now have another power in your growing list of Python abilities. In this lecture, we addressed…

- Loops
- `while`
- `for`
- `len`
- `list`
- `dict`
