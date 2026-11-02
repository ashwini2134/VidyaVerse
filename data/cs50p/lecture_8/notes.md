# Lecture 8

> Source: [CS50P 2022 — Lecture 8](https://cs50.harvard.edu/python/2022/notes/8/#object-oriented-programming)

## Object-Oriented Programming

- There are different paradigms of programming. Up until this point, you have worked procedurally, step-by-step.
- Object-oriented programming (OOP) is a compelling solution to programming-related problems.
- Consider a procedural program:

```python
name = input("Name: ")
house = input("House: ")
print(f"{name} from {house}")
```

- We can abstract parts away with functions, and even return two values as a `tuple`:

```python
def main():
    name, house = get_student()
    print(f"{name} from {house}")


def get_student():
    name = input("Name: ")
    house = input("House: ")
    return name, house


if __name__ == "__main__":
    main()
```

- `tuple`s are immutable. A `list` is mutable. A `dict` provides key-value pairs:

```python
def main():
    student = get_student()
    print(f"{student['name']} from {student['house']}")


def get_student():
    name = input("Name: ")
    house = input("House: ")
    return {"name": name, "house": house}


if __name__ == "__main__":
    main()
```

## Classes

- Classes are a way by which, in object-oriented programming, we can create our own type of data and give them names. A class is like a mold for a type of data.

```python
class Student:
    ...


def main():
    student = get_student()
    print(f"{student.name} from {student.house}")


def get_student():
    student = Student()
    student.name = input("Name: ")
    student.house = input("House: ")
    return student


if __name__ == "__main__":
    main()
```

  Any time you use a class blueprint to create something, you create an "object" or an "instance".

- We can lay groundwork for the attributes expected inside an object using `__init__`:

```python
class Student:
    def __init__(self, name, house):
        self.name = name
        self.house = house


def main():
    student = get_student()
    print(f"{student.name} from {student.house}")


def get_student():
    name = input("Name: ")
    house = input("House: ")
    return Student(name, house)


if __name__ == "__main__":
    main()
```

  `self` refers to the current object that was just created.

- You can learn more in Python's documentation of [classes](https://docs.python.org/3/tutorial/classes.html).

## raise

- What if someone tries to create a student without a name? We can `raise` our own exceptions:

```python
class Student:
    def __init__(self, name, house):
        if not name:
            raise ValueError("Missing name")
        if house not in ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"]:
            raise ValueError("Invalid house")
        self.name = name
        self.house = house
```

- Python allows you to define how an object is printed via `__str__`:

```python
class Student:
    def __init__(self, name, house):
        if not name:
            raise ValueError("Missing name")
        if house not in ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"]:
            raise ValueError("Invalid house")
        self.name = name
        self.house = house

    def __str__(self):
        return f"{self.name} from {self.house}"
```

  `__str__` provides a means by which an object is returned (as a string) when printed.

## Decorators

- Properties can be utilized to harden our code. In Python, we define properties using function "decorators", which begin with `@`:

```python
class Student:
    def __init__(self, name, house):
        self.name = name
        self.house = house

    def __str__(self):
        return f"{self.name} from {self.house}"

    @property
    def house(self):
        return self._house

    @house.setter
    def house(self, house):
        if house not in ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"]:
            raise ValueError("Invalid house")
        self._house = house
```

  `@property` defines `house` as a property of our class. The "setter", via `@house.setter`, is called whenever the house property is set. `_house` is the class attribute itself; the leading underscore indicates users shouldn't modify it directly.

## Class Methods

- Sometimes, we want to add functionality to a class itself, not to instances of that class. `@classmethod` is used for this:

```python
import random


class Hat:

    houses = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"]

    @classmethod
    def sort(cls, name):
        print(name, "is in", random.choice(cls.houses))


Hat.sort("Harry")
```

  We specify `sort` as a `@classmethod`, replacing `self` with `cls`. It can be called without instantiating a `Hat`.

- Returning to `students.py`:

```python
class Student:
    def __init__(self, name, house):
        self.name = name
        self.house = house

    def __str__(self):
        return f"{self.name} from {self.house}"

    @classmethod
    def get(cls):
        name = input("Name: ")
        house = input("House: ")
        return cls(name, house)


def main():
    student = Student.get()
    print(student)


if __name__ == "__main__":
    main()
```

## Static Methods

- Besides `@classmethod`, there are other types of methods. Using `@staticmethod` may be something you might wish to explore.

## Inheritance

- Inheritance is, perhaps, the most powerful feature of object-oriented programming. You can create a class that "inherits" methods, variables, and attributes from another class:

```python
class Wizard:
    def __init__(self, name):
        if not name:
            raise ValueError("Missing name")
        self.name = name


class Student(Wizard):
    def __init__(self, name, house):
        super().__init__(name)
        self.house = house


class Professor(Wizard):
    def __init__(self, name, subject):
        super().__init__(name)
        self.subject = subject


wizard = Wizard("Albus")
student = Student("Harry", "Gryffindor")
professor = Professor("Severus", "Defense Against the Dark Arts")
```

  Within the "child" class `Student`, the line `super().__init__(name)` runs the `init` method of `Wizard`.

## Operator Overloading

- Some operators such as `+` can be "overloaded" such that they can have more abilities beyond simple arithmetic:

```python
class Vault:
    def __init__(self, galleons=0, sickles=0, knuts=0):
        self.galleons = galleons
        self.sickles = sickles
        self.knuts = knuts

    def __str__(self):
        return f"{self.galleons} Galleons, {self.sickles} Sickles, {self.knuts} Knuts"

    def __add__(self, other):
        galleons = self.galleons + other.galleons
        sickles = self.sickles + other.sickles
        knuts = self.knuts + other.knuts
        return Vault(galleons, sickles, knuts)


potter = Vault(100, 50, 25)
weasley = Vault(25, 50, 100)
total = potter + weasley
print(total)
```

  `self` is what is on the left of the `+` operand; `other` is what is right of the `+`.

- You can learn more in Python's documentation of [operator overloading](https://docs.python.org/3/reference/datamodel.html#special-method-names).

## Summing Up

Now, you've learned a whole new level of capability through object-oriented programming.

- Object-oriented programming
- Classes
- `raise`
- Class Methods
- Static Methods
- Inheritance
- Operator Overloading
