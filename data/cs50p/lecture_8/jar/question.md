# Cookie Jar

Suppose that you'd like to implement a cookie jar in which to store cookies.

In a file called `jar.py`, implement a `class` called `Jar` with these methods:

- `__init__` should initialize a cookie jar with the given `capacity` (the maximum number of cookies that can fit). If `capacity` is not a non-negative `int`, raise a `ValueError`.
- `__str__` should return a `str` with `n` cookie emoji (🍪), where `n` is the number of cookies in the jar. For 3 cookies, it returns `"🍪🍪🍪"`.
- `deposit(n)` should add `n` cookies. If adding that many would exceed capacity, raise a `ValueError`.
- `withdraw(n)` should remove `n` cookies. If there aren't that many in the jar, raise a `ValueError`.
- `capacity` (a property) should return the jar's capacity.
- `size` (a property) should return the number of cookies in the jar, initially `0`.

```python
class Jar:
    def __init__(self, capacity=12):
        ...

    def __str__(self):
        ...

    def deposit(self, n):
        ...

    def withdraw(self, n):
        ...

    @property
    def capacity(self):
        ...

    @property
    def size(self):
        ...
```

CS50 also asks you to implement `test_jar.py` with four or more test functions.

```
check50 cs50/problems/2022/python/jar
```
