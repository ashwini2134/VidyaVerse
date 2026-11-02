import random

choices = ["rock", "paper", "scissors"]
user_score = 0
computer_score = 0

print("Welcome to Rock, Paper, Scissors!")

while True:
    user = input("Enter rock, paper, or scissors: ").lower()
    while user not in choices:
        user = input("Invalid choice. Enter rock, paper, or scissors: ").lower()

    computer = random.choice(choices)
    print(f"Computer chose: {computer}")

    if user == computer:
        print("It's a tie!")
    elif (user == "rock" and computer == "scissors") or \
         (user == "scissors" and computer == "paper") or \
         (user == "paper" and computer == "rock"):
        print("You win!")
        user_score += 1
    else:
        print("You lose!")
        computer_score += 1

    print(f"Score — You: {user_score}, Computer: {computer_score}")
    again = input("Play again? (y/n): ").lower()
    if again != "y":
        break

print(f"Final score — You: {user_score}, Computer: {computer_score}")
print("Goodbye!")
