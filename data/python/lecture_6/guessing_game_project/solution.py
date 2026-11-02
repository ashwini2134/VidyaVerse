import random

print("Welcome to the Number Guessing Game!")
print("1. Easy (1-50, 10 guesses)")
print("2. Medium (1-100, 7 guesses)")
print("3. Hard (1-200, 5 guesses)")

choice = input("Enter choice (1/2/3): ")

if choice == "1":
    max_num = 50
    max_guesses = 10
elif choice == "2":
    max_num = 100
    max_guesses = 7
else:
    max_num = 200
    max_guesses = 5

secret = random.randint(1, max_num)
print(f"\nI'm thinking of a number between 1 and {max_num}.")
print(f"You have {max_guesses} guesses.\n")

for guess_num in range(1, max_guesses + 1):
    guess = int(input(f"Guess {guess_num}: "))
    if guess == secret:
        print(f"Correct! You got it in {guess_num} guesses!")
        break
    elif guess < secret:
        print("Too low!")
    else:
        print("Too high!")
else:
    print(f"Out of guesses! The number was {secret}.")
