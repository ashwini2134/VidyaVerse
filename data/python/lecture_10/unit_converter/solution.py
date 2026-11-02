def celsius_to_fahrenheit(c):
    return (c * 9/5) + 32

def fahrenheit_to_celsius(f):
    return (f - 32) * 5/9

def km_to_miles(km):
    return km * 0.621371

def miles_to_km(miles):
    return miles / 0.621371

def kg_to_pounds(kg):
    return kg * 2.20462

def pounds_to_kg(pounds):
    return pounds / 2.20462

def hours_to_minutes(h):
    return h * 60

def minutes_to_hours(min):
    return min / 60

while True:
    print("\n--- Unit Converter Toolkit ---")
    print("1. Temperature (Celsius ↔ Fahrenheit)")
    print("2. Length (km ↔ miles)")
    print("3. Weight (kg ↔ pounds)")
    print("4. Time (hours ↔ minutes)")
    print("5. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        print("\n1. Celsius to Fahrenheit")
        print("2. Fahrenheit to Celsius")
        sub = input("Enter choice: ")
        val = float(input("Enter value: "))
        if sub == "1":
            print(f"{val}°C = {celsius_to_fahrenheit(val):.1f}°F")
        else:
            print(f"{val}°F = {fahrenheit_to_celsius(val):.1f}°C")

    elif choice == "2":
        print("\n1. km to miles")
        print("2. miles to km")
        sub = input("Enter choice: ")
        val = float(input("Enter value: "))
        if sub == "1":
            print(f"{val} km = {km_to_miles(val):.1f} miles")
        else:
            print(f"{val} miles = {miles_to_km(val):.1f} km")

    elif choice == "3":
        print("\n1. kg to pounds")
        print("2. pounds to kg")
        sub = input("Enter choice: ")
        val = float(input("Enter value: "))
        if sub == "1":
            print(f"{val} kg = {kg_to_pounds(val):.1f} lbs")
        else:
            print(f"{val} lbs = {pounds_to_kg(val):.1f} kg")

    elif choice == "4":
        print("\n1. hours to minutes")
        print("2. minutes to hours")
        sub = input("Enter choice: ")
        val = float(input("Enter value: "))
        if sub == "1":
            print(f"{val} hours = {hours_to_minutes(val):.1f} minutes")
        else:
            print(f"{val} minutes = {minutes_to_hours(val):.1f} hours")

    elif choice == "5":
        print("Goodbye!")
        break

    else:
        print("Invalid choice.")
