def main():
    num1 = float(input())
    num2 = float(input())
    op = input().strip()
    
    if op == '+':
        print(num1 + num2)
    elif op == '-':
        print(num1 - num2)
    elif op == '*':
        print(num1 * num2)
    elif op == '/':
        if num2 != 0:
            print(num1 / num2)

if __name__ == "__main__":
    main()
