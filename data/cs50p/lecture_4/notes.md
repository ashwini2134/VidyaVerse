# Lecture 4

> Source: [CS50P 2022 — Lecture 4](https://cs50.harvard.edu/python/2022/notes/4/#libraries)

## Libraries

- Generally, libraries are bits of code written by you or others that you can use in your program.
- Python allows you to share functions or features with others as "modules".
- If you copy and paste code from an old project, chances are you can create such a module or library that you could bring into your new project.

## Random

- `random` is a library that comes with Python that you could import into your own project.
- So, how do you load a module into your own program? You can use the word `import`.

```python
import random

coin = random.choice(["heads", "tails"])
print(coin)
```

- `from` allows us to be very specific about what we'd like to import:

```python
from random import choice

coin = choice(["heads", "tails"])
print(coin)
```

- Consider the function `random.randint(a, b)`. This function will generate a random number between `a` and `b`:

```python
import random

number = random.randint(1, 10)
print(number)
```

- We can introduce `random.shuffle(x)` where it will shuffle a list into a random order:

```python
import random

cards = ["jack", "queen", "king"]
random.shuffle(cards)
for card in cards:
    print(card)
```

- You can learn more in Python's documentation of [`random`](https://docs.python.org/3/library/random.html).

## Statistics

- Python comes with a built-in `statistics` library. `mean` is a function of this library that is quite useful:

```python
import statistics

print(statistics.mean([100, 90]))
```

- You can learn more in Python's documentation of [`statistics`](https://docs.python.org/3/library/statistics.html).

## Command-Line Arguments

- What if we wanted to be able to take input from the command-line? For example, rather than typing `python average.py`, what if we wanted to type `python average.py 100 90`?
- `sys` is a module that allows us to take arguments at the command line. `argv` is within the `sys` module:

```python
import sys

print("hello, my name is", sys.argv[1])
```

  If you type `python name.py David`, you will see `hello, my name is David`. `sys.argv[1]` is where `David` is being stored. What is held in `sys.argv[0]`? If you guessed `name.py`, you would be correct!

- What if the user does not type in the name at the command line? An error `list index out of range` will be presented. Here's how we can protect our program:

```python
import sys

try:
    print("hello, my name is", sys.argv[1])
except IndexError:
    print("Too few arguments")
```

- Our program can be improved:

```python
import sys

if len(sys.argv) < 2:
    print("Too few arguments")
elif len(sys.argv) > 2:
    print("Too many arguments")
else:
    print("hello, my name is", sys.argv[1])
```

- There is something very nice about keeping our error checking separate from the remainder of our code:

```python
import sys

if len(sys.argv) < 2:
    sys.exit("Too few arguments")
elif len(sys.argv) > 2:
    sys.exit("Too many arguments")

print("hello, my name is", sys.argv[1])
```

  `sys.exit` provides a means by which the program can exit if an error arises.

- You can learn more in Python's documentation of [`sys`](https://docs.python.org/3/library/sys.html).

## slice

- `slice` allows us to take a `list` and tell the interpreter where we want the start of the `list` and the end of the `list`:

```python
import sys

if len(sys.argv) < 2:
    sys.exit("Too few arguments")

for arg in sys.argv[1:]:
    print("hello, my name is", arg)
```

  Rather than starting the list at `0`, we use square brackets to tell the interpreter to start at `1` and go to the end using the `1:` argument.

## Packages

- One of the reasons Python is so popular is that there are numerous powerful third-party libraries. We call these third-party libraries, implemented as a folder, "packages".
- PyPI is a repository or directory of all available third-party packages.
- Python has a package manager called `pip` that allows you to install packages quickly. For example: `pip install cowsay`.

```python
import cowsay
import sys

if len(sys.argv) == 2:
    cowsay.cow("hello, " + sys.argv[1])
```

- You can find other third-party packages at [PyPI](https://pypi.org/).

## APIs

- APIs or "application program interfaces" allow you to connect to the code of others.
- `requests` is a package that allows your program to behave as a web browser would. In your terminal, type `pip install requests`.
- It turns out that Apple iTunes has its own API. The format returned is called JSON, a text-based format used to exchange data between applications.

```python
import requests
import sys

if len(sys.argv) != 2:
    sys.exit()

response = requests.get("https://itunes.apple.com/search?entity=song&limit=1&term=" + sys.argv[1])
print(response.json())
```

- Python has a built-in JSON library that can help us interpret the data received:

```python
import json
import requests
import sys

if len(sys.argv) != 2:
    sys.exit()

response = requests.get("https://itunes.apple.com/search?entity=song&limit=1&term=" + sys.argv[1])
print(json.dumps(response.json(), indent=2))
```

- How could we output just the track name?

```python
import json
import requests
import sys

if len(sys.argv) != 2:
    sys.exit()

response = requests.get("https://itunes.apple.com/search?entity=song&limit=50&term=" + sys.argv[1])

o = response.json()
for result in o["results"]:
    print(result["trackName"])
```

- You can learn more about `requests` through the [library's documentation](https://docs.python-requests.org/), and about JSON in Python's documentation of [JSON](https://docs.python.org/3/library/json.html).

## Making Your Own Libraries

- You have the ability as a Python programmer to create your own library! In your terminal window, type `code sayings.py`:

```python
def hello(name):
    print(f"hello, {name}")


def goodbye(name):
    print(f"goodbye, {name}")
```

- Let's see how we could implement code utilizing this package. In the terminal window, type `code say.py`:

```python
import sys

from sayings import goodbye

if len(sys.argv) == 2:
    goodbye(sys.argv[1])
```

  This code imports the abilities of `goodbye` from the `sayings` package.

## Summing Up

Libraries extend the abilities of Python. Some libraries are included by default with Python and simply need to be imported. Others are third-party packages that need to be installed using `pip`. You can make your own packages for use by yourself or others! In this lecture, you learned about…

- Libraries
- Random
- Statistics
- Command-Line Arguments
- Slice
- Packages
- APIs
- Making Your Own Libraries
