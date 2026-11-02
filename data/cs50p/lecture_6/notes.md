# Lecture 6

> Source: [CS50P 2022 — Lecture 6](https://cs50.harvard.edu/python/2022/notes/6/#file-io)

## File I/O

- Up until now, everything we've programmed has stored information in memory. Once the program ends, all information gathered is lost.
- File I/O is the ability of a program to take a file as input or create a file as output.
- Recall that a `list` is a data structure that allows us to store multiple values into a single variable:

```python
names = []

for _ in range(3):
    names.append(input("What's your name? "))

for name in sorted(names):
    print(f"hello, {name}")
```

  Once this program is executed, all information is lost. File I/O allows your program to store this information such that it can be used later.

## open

- `open` is a functionality built into Python that allows you to open a file and utilize it in your program:

```python
name = input("What's your name? ")

file = open("names.txt", "w")
file.write(name)
file.close()
```

  The `open` function opens a file called `names.txt` with writing enabled, as signified by the `w`.

- Running this program multiple times will entirely rewrite the file each time. Ideally, we want to append. The `a` mode means "append":

```python
name = input("What's your name? ")

file = open("names.txt", "a")
file.write(f"{name}\n")
file.close()
```

- It's quite easy to forget to close the file.

## with

- The keyword `with` allows you to automate the closing of a file:

```python
name = input("What's your name? ")

with open("names.txt", "a") as file:
    file.write(f"{name}\n")
```

- What if we want to read from a file? Use `r` mode:

```python
with open("names.txt", "r") as file:
    lines = file.readlines()

for line in lines:
    print("hello,", line.rstrip())
```

  `readlines` reads all the lines of a file and stores them in a list. `rstrip` removes the extraneous line break at the end of each line.

- This code could be simplified:

```python
with open("names.txt", "r") as file:
    for line in file:
        print("hello,", line.rstrip())
```

- This could be further improved to allow for sorting the names:

```python
names = []

with open("names.txt") as file:
    for line in file:
        names.append(line.rstrip())

for name in sorted(names):
    print(f"hello, {name}")
```

## CSV

- CSV stands for "comma separated values".
- Let's create `students.csv` with content like `Hermione,Gryffindor` on each line, and read it:

```python
with open("students.csv") as file:
    for line in file:
        row = line.rstrip().split(",")
        print(f"{row[0]} is in {row[1]}")
```

  `split` tells the interpreter where to find the end of each value.

- The `split` function returns multiple values, so we can assign two variables at once:

```python
with open("students.csv") as file:
    for line in file:
        name, house = line.rstrip().split(",")
        print(f"{name} is in {house}")
```

- We can sort a list of dictionaries by a key:

```python
students = []

with open("students.csv") as file:
    for line in file:
        name, house = line.rstrip().split(",")
        students.append({"name": name, "house": house})

for student in sorted(students, key=lambda student: student["name"]):
    print(f"{student['name']} is in {student['house']}")
```

  We use a `lambda` function, an anonymous function, to tell `sorted` which key to sort on.

- Our code is a bit fragile. If a value itself contains a comma (e.g., `"Number Four, Privet Drive"`), splitting on `,` breaks. Python's built-in `csv` library comes with a `reader`:

```python
import csv

students = []

with open("students.csv") as file:
    reader = csv.reader(file)
    for row in reader:
        students.append({"name": row[0], "home": row[1]})

for student in sorted(students, key=lambda student: student["name"]):
    print(f"{student['name']} is from {student['home']}")
```

- It's better design to bake the column names into the CSV file (a header row) and use a `DictReader`:

```python
import csv

students = []

with open("students.csv") as file:
    reader = csv.DictReader(file)
    for row in reader:
        students.append({"name": row["name"], "home": row["home"]})

for student in sorted(students, key=lambda student: student["name"]):
    print(f"{student['name']} is in {student['home']}")
```

- What if we want to write to a CSV file? Use `DictWriter`:

```python
import csv

name = input("What's your name? ")
home = input("Where's your home? ")

with open("students.csv", "a") as file:
    writer = csv.DictWriter(file, fieldnames=["name", "home"])
    writer.writerow({"name": name, "home": home})
```

- You can learn more in Python's documentation of [CSV](https://docs.python.org/3/library/csv.html).

## Binary Files and PIL

- A binary file is simply a collection of ones and zeros. This type of file can store anything, including music and image data.
- There is a popular Python library called `PIL` that works well with image files. Animated GIFs are a popular type of image file that has many image files within it that are played in sequence.

```python
import sys

from PIL import Image

images = []

for arg in sys.argv[1:]:
    image = Image.open(arg)
    images.append(image)

images[0].save(
    "costumes.gif", save_all=True, append_images=[images[1]], duration=200, loop=0
)
```

  We import the `Image` functionality from `PIL`. The first `for` loop loops through the images provided as command-line arguments. The last lines save the first image and append a second image, creating an animated GIF.

- You can learn more in Pillow's documentation of [PIL](https://pillow.readthedocs.io/).

## Summing Up

Now, we have not only seen that we can write and read files textually—we can also read and write files using ones and zeros. In this lecture, you learned about…

- File I/O
- `open`
- `with`
- CSV
- `PIL`
