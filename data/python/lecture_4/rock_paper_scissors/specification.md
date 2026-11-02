# Specification

## Requirements

1. Display a welcome message at the start.
2. Prompt the user to enter `rock`, `paper`, or `scissors`.
3. Handle case-insensitive input (e.g., "Rock", "ROCK", "rock" all work).
4. The computer selects a random choice using `random.choice()`.
5. Determine the winner:
   - Rock beats Scissors
   - Scissors beats Paper
   - Paper beats Rock
   - Same choice = tie
6. Display both choices and the result each round.
7. Track and display the score after each round.
8. After each round, ask "Play again? (y/n):".
9. When the user quits, show the final score and a goodbye message.

## Constraints

- Use `import random` for the computer's choice.
- Validate that the user enters a valid option; if not, prompt again.
- The game must support multiple rounds until the user quits.
