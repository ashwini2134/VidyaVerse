# Specification

## Requirements

1. Display a welcome message and difficulty menu.
2. Let the user choose Easy, Medium, or Hard.
3. Based on difficulty:
   - **Easy:** range 1-50, 10 guesses
   - **Medium:** range 1-100, 7 guesses
   - **Hard:** range 1-200, 5 guesses
4. Generate a random number in the chosen range.
5. Let the user guess repeatedly until they run out of guesses or guess correctly.
6. After each wrong guess, tell the user "Too high!" or "Too low!".
7. Track the number of guesses taken.
8. If the user wins, display "Correct! You got it in X guesses!"
9. If the user loses, reveal the number.
10. Ask if they want to play again.

## Constraints

- Use `import random`.
- Validate the difficulty choice (re-prompt if invalid).
- Validate each guess is a number in the valid range.
- Use a `while` loop for the guess loop.
