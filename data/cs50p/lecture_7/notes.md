# Lecture 7

> Source: [CS50P 2022 — Lecture 7](https://cs50.harvard.edu/python/2022/notes/7/#regular-expressions)

## Regular Expressions

- Regular expressions or "regexes" will enable us to examine patterns within our code. For example, we might want to validate that an email address is formatted correctly.
- To begin, consider validating an email address naively:

```python
email = input("What's your email? ").strip()

if "@" in email:
    print("Valid")
else:
    print("Invalid")
```

- One could input `@@` alone and it would be regarded as valid. We could require at least one `@` and a `.`:

```python
email = input("What's your email? ").strip()

if "@" in email and "." in email:
    print("Valid")
else:
    print("Invalid")
```

- Python has an existing library called `re` with functions that can validate user inputs against patterns. One of the most versatile is `search`, with signature `re.search(pattern, string, flags=0)`.
- Many special symbols can be passed to the interpreter for validation. A non-exhaustive list:

```text
.   any character except a new line
*   0 or more repetitions
+   1 or more repetitions
?   0 or 1 repetition
{m} m repetitions
{m,n} m-n repetitions
```

- Implementing this:

```python
import re

email = input("What's your email? ").strip()

if re.search(".+@.+", email):
    print("Valid")
else:
    print("Invalid")
```

  `.+` is used to determine if anything is to the left and right of the `@`.

- We can be more precise. More symbols:

```text
^   matches the start of the string
$   matches the end of the string
```

- Then:

```python
import re

email = input("What's your email? ").strip()

if re.search(r"^.+@.+\.edu$", email):
    print("Valid")
else:
    print("Invalid")
```

  We utilize the "escape character" `\` to treat the `.` as a literal period. The `r` prefix makes this a "raw string" so the interpreter won't treat `\.` as a special character.

- More symbols for sets:

```text
[]    set of characters
[^]   complementing the set
```

- We can use these:

```python
import re

email = input("What's your email? ").strip()

if re.search(r"^[^@]+@[^@]+\.edu$", email):
    print("Valid")
else:
    print("Invalid")
```

  `[^@]+` means any character except an `@`.

- Common patterns are built in:

```text
\d    decimal digit
\D    not a decimal digit
\s    whitespace characters
\S    not a whitespace character
\w    word character, as well as numbers and the underscore
\W    not a word character
```

  `\w` is the same as `[a-zA-Z0-9_]`.

- We could support multiple TLDs using the `|` ("or"):

```python
import re

email = input("What's your email? ").strip()

if re.search(r"^\w+@\w+\.(com|edu|gov|net|org)$", email):
    print("Valid")
else:
    print("Invalid")
```

- Grouping symbols:

```text
A|B     either A or B
(...)   a group
(?:...) non-capturing version
```

## Case Sensitivity

- Within `re.search`, there is a parameter for `flags`. Some built-in flag variables are `re.IGNORECASE`, `re.MULTILINE`, and `re.DOTALL`:

```python
import re

email = input("What's your email? ").strip()

if re.search(r"^\w+@\w+\.edu$", email, re.IGNORECASE):
    print("Valid")
else:
    print("Invalid")
```

- We can group together ideas to allow optional subdomains:

```python
import re

email = input("What's your email? ").strip()

if re.search(r"^\w+@(\w+\.)?\w+\.edu$", email, re.IGNORECASE):
    print("Valid")
else:
    print("Invalid")
```

  The `(\w+\.)?` communicates that this expression can be there once or not at all.

## Cleaning Up User Input

- Consider standardizing a name typed as `Last, First`:

```python
name = input("What's your name? ").strip()
if "," in name:
    last, first = name.split(", ")
    name = f"{first} {last}"
print(f"hello, {name}")
```

- Using regular expressions:

```python
import re

name = input("What's your name? ").strip()
matches = re.search(r"^(.+), (.+)$", name)
if matches:
    last, first = matches.groups()
    name = first + " " + last
print(f"hello, {name}")
```

- We can request specific groups back using `matches.group`:

```python
import re

name = input("What's your name? ").strip()
matches = re.search(r"^(.+), (.+)$", name)
if matches:
    name = matches.group(2) + " " + matches.group(1)
print(f"hello, {name}")
```

- We can combine the search and the assignment with the walrus `:=` operator:

```python
import re

name = input("What's your name? ").strip()
if matches := re.search(r"^(.+), *(.+)$", name):
    name = matches.group(2) + " " + matches.group(1)
print(f"hello, {name}")
```

## Extracting User Input

- Now, let's extract specific information. To extract a Twitter username from a URL:

```python
import re

url = input("URL: ").strip()

username = url.replace("https://twitter.com/", "")
print(f"Username: {username}")
```

- `removeprefix` is cleaner than `replace`:

```python
import re

url = input("URL: ").strip()

username = url.removeprefix("https://twitter.com/")
print(f"Username: {username}")
```

- Using `re.sub` with signature `re.sub(pattern, repl, string, count=0, flags=0)`:

```python
import re

url = input("URL: ").strip()

username = re.sub(r"^(https?://)?(www\.)?twitter\.com/", "", url)
print(f"Username: {username}")
```

- Using `re.search` to be more robust:

```python
import re

url = input("URL: ").strip()

if matches := re.search(r"^https?://(?:www\.)?twitter\.com/([a-z0-9_]+)", url, re.IGNORECASE):
    print(f"Username:", matches.group(1))
```

  The `?:` tells the interpreter it does not have to capture what is in that spot.

- You can learn more in Python's documentation of [re](https://docs.python.org/3/library/re.html).

## Summing Up

Now, you've learned a whole new language of regular expressions that can be utilized to validate, clean up, and extract user input.

- Regular Expressions
- Case Sensitivity
- Cleaning Up User Input
- Extracting User Input
