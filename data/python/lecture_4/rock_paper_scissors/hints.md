# Hints

1. Start by importing `random` and creating a list of choices: `["rock", "paper", "scissors"]`.
2. Use `input().lower()` to normalize the user's choice so "Rock" and "rock" both work.
3. Use `random.choice(choices)` for the computer's pick.
4. Use nested `if`/`elif`/`else` to compare choices and determine the winner.
5. Wrap the game logic in a `while True` loop and `break` when the user doesn't want to play again.
