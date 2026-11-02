import random


def main():
    level = get_level()
    score = 0
    for _ in range(10):
        x = generate_integer(level)
        y = generate_integer(level)
        attempts = 0
        while attempts < 3:
            try:
                answer = int(input(f"{x} + {y} = "))
            except ValueError:
                print("EEE")
                attempts += 1
                continue
            if answer == x + y:
                score += 1
                break
            else:
                print("EEE")
                attempts += 1
        else:
            print(f"{x} + {y} = {x + y}")
    print(f"Score: {score}")


def get_level():
    while True:
        try:
            level = int(input("Level: "))
        except ValueError:
            continue
        if level in [1, 2, 3]:
            return level


def generate_integer(level):
    if level == 1:
        return random.randint(0, 9)
    elif level == 2:
        return random.randint(10, 99)
    elif level == 3:
        return random.randint(100, 999)
    else:
        raise ValueError


if __name__ == "__main__":
    main()
