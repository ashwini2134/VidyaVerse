# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
def main():
    calories = {
        "Apple": 130,
        "Avocado": 50,
        "Banana": 110,
        "Cantaloupe": 50,
        "Grapefruit": 60,
        "Grapes": 90,
        "Honeydew Melon": 50,
        "Kiwifruit": 90,
        "Lemon": 15,
        "Lime": 20,
        "Nectarine": 60,
        "Orange": 80,
        "Papaya": 70,
        "Pear": 100,
        "Pineapple": 80,
        "Plum": 70,
        "Strawberries": 50,
        "Sweet Cherries": 100,
        "Tangerine": 50,
        "Watermelon": 80,
    }
    fruit = input("Item: ").title()
    if fruit in calories:
        print(f"Calories: {calories[fruit]}")


if __name__ == "__main__":
    main()
