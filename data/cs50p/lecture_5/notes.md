# Lecture 5

> Source: [CS50P 2022 — Lecture 5](https://cs50.harvard.edu/python/2022/notes/5/#unit-tests)

## Unit Tests

- Up until now, you have likely been testing your own code using `print` statements, or relying upon CS50 to test your code for you.
- It's most common in industry to write code to test your own programs.
- In your console window, type `code calculator.py`:

```python
def main():
    x = int(input("What's x? "))
    print("x squared is", square(x))


def square(n):
    return n * n


if __name__ == "__main__":
    main()
```

- Following convention, let's create a new test program by typing `code test_calculator.py`:

```python
from calculator import square


def main():
    test_square()


def test_square():
    if square(2) != 4:
        print("2 squared was not 4")
    if square(3) != 9:
        print("3 squared was not 9")


if __name__ == "__main__":
    main()
```

  We are importing the `square` function on the first line. By convention, we create a function called `test_square`.

## assert

- Python's `assert` command allows us to tell the interpreter that some assertion is true:

```python
from calculator import square


def main():
    test_square()


def test_square():
    assert square(2) == 4
    assert square(3) == 9


if __name__ == "__main__":
    main()
```

- If an assertion is not met, the interpreter raises an `AssertionError`.
- One challenge: our code could become burdensome if we wanted to provide more descriptive error output:

```python
from calculator import square


def main():
    test_square()


def test_square():
    try:
        assert square(2) == 4
    except AssertionError:
        print("2 squared is not 4")
    try:
        assert square(3) == 9
    except AssertionError:
        print("3 squared is not 9")


if __name__ == "__main__":
    main()
```

- You can learn more in Python's documentation of [`assert`](https://docs.python.org/3/reference/simple_stmts.html#assert).

## pytest

- `pytest` is a third-party library that allows you to unit test your program. To utilize `pytest`, type `pip install pytest`.
- Modify your `test_calculator` function as follows:

```python
from calculator import square


def test_assert():
    assert square(2) == 4
    assert square(3) == 9
    assert square(-2) == 4
    assert square(-3) == 9
    assert square(0) == 0
```

- In the terminal window, type `pytest test_calculator.py`. Output will be provided, with a red `F` near the top indicating that something failed.
- It is not ideal that `pytest` will stop running after the first failed test. Let's divide the code into different groups of tests:

```python
from calculator import square


def test_positive():
    assert square(2) == 4
    assert square(3) == 9


def test_negative():
    assert square(-2) == 4
    assert square(-3) == 9


def test_zero():
    assert square(0) == 0
```

  Testing frameworks like `pytest` will run each function, even if there was a failure in one of them.

- Finally, we can test that our program handles exceptions:

```python
import pytest

from calculator import square


def test_positive():
    assert square(2) == 4
    assert square(3) == 9


def test_negative():
    assert square(-2) == 4
    assert square(-3) == 9


def test_zero():
    assert square(0) == 0


def test_str():
    with pytest.raises(TypeError):
        square("cat")
```

  Instead of using `assert`, we take advantage of `pytest.raises`, which allows you to express that you expect an error to be raised.

- You can learn more in Pytest's documentation of [`pytest`](https://docs.pytest.org/en/7.1.x/getting-started.html).

## Testing Strings

- Consider the following code for `hello.py`:

```python
def main():
    name = input("What's your name? ")
    hello(name)


def hello(to="world"):
    print("hello,", to)


if __name__ == "__main__":
    main()
```

- Why might a test not work well here? Notice that the `hello` function *prints* something: it does not *return* a value! We can change our `hello` function to return a string:

```python
def main():
    name = input("What's your name? ")
    print(hello(name))


def hello(to="world"):
    return f"hello, {to}"


if __name__ == "__main__":
    main()
```

- Now we can use `pytest` to test the `hello` function:

```python
from hello import hello


def test_default():
    assert hello() == "hello, world"


def test_argument():
    assert hello("David") == "hello, David"
```

## Organizing Tests into Folders

- Unit testing code using multiple tests is so common that you can run a whole folder of tests with a single command.
- First, in the terminal window, execute `mkdir test` to create a folder called `test`.
- Then create a test within that folder: `code test/test_hello.py`:

```python
from hello import hello


def test_default():
    assert hello() == "hello, world"


def test_argument():
    assert hello("David") == "hello, David"
```

- `pytest` will not allow us to run tests as a folder without a special `__init__` file. Create this file by typing `code test/__init__.py`. Even leaving this `__init__.py` file empty, `pytest` is informed that the whole folder containing `__init__.py` has tests that can be run.
- Now, typing `pytest test` in the terminal, you can run the entire `test` folder of code.

## Summing Up

Testing your code is a natural part of the programming process. Unit tests allow you to test specific aspects of your code. In this lecture, you learned about…

- Unit tests
- `assert`
- `pytest`
