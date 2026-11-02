# Guessing Game

In a file called `game.py`, implement a program that:

- Prompts the user for a level, `n`. If the user does not input a positive integer, the program should prompt again.
- Randomly generates an integer between 1 and `n`, inclusive, using the `random` module.
- Prompts the user to guess that integer. If the guess is not a positive integer, the program should prompt the user again.
  - If the guess is smaller than that integer, output `Too small!` and prompt again.
  - If the guess is larger than that integer, output `Too large!` and prompt again.
  - If the guess is the same as that integer, output `Just right!` and exit.

## How to Test

- `Level: cat` → reprompt
- `Level: 10`, `Guess: 100` → `Too large!`
- `Level: 10`, `Guess: 1` → `Too small!`
- guess the number → `Just right!`

```
check50 cs50/problems/2022/python/game
```
