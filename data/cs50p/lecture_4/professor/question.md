# Little Professor

Little Professor is a "calculator" that generates ten math problems. If the user answers incorrectly, it displays `EEE`; after three incorrect answers for the same problem, it displays the correct answer.

In a file called `professor.py`, implement a program that:

- Prompts the user for a level, `n`. If the user does not input `1`, `2`, or `3`, prompt again.
- Randomly generates ten math problems formatted as `X + Y = `, wherein each of `X` and `Y` is a non-negative integer with `n` digits.
- Prompts the user to solve each. If an answer is not correct (or not a number), output `EEE` and prompt again, up to three tries per problem; after three tries, output the correct answer.
- Ultimately outputs the user's score: the number of correct answers out of 10.

Structure your program with `get_level()` (returns 1, 2, or 3) and `generate_integer(level)` (returns a random non-negative integer with `level` digits, or raises `ValueError` if `level` is not 1, 2, or 3).

## How to Test

- `Level: 4` → reprompt
- `Level: 1` → poses 10 problems like `6 + 6 =`
- wrong answer → `EEE`; after 3 wrong → shows `6 + 6 = 12`
- ends by printing `Score: <n>`

```
check50 cs50/problems/2022/python/professor
```
