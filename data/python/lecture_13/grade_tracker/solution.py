import os

FILE_NAME = "grades.txt"
students = {}

def load_data():
    global students
    if not os.path.exists(FILE_NAME):
        return
    with open(FILE_NAME, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("|")
            if len(parts) == 3:
                name, subject, grade = parts
                if name not in students:
                    students[name] = {}
                students[name][subject] = float(grade)

def save_data():
    with open(FILE_NAME, "w") as f:
        for name, subjects in students.items():
            for subject, grade in subjects.items():
                f.write(f"{name}|{subject}|{grade}\n")

def add_student():
    name = input("Enter student name: ")
    if name in students:
        print("Student already exists.")
    else:
        students[name] = {}
        print(f"Student '{name}' added.")

def add_grade():
    name = input("Enter student name: ")
    if name not in students:
        print("Student not found.")
        return
    subject = input("Enter subject: ")
    try:
        grade = float(input("Enter grade: "))
        if grade < 0 or grade > 100:
            print("Grade must be between 0 and 100.")
            return
    except ValueError:
        print("Invalid grade. Must be a number.")
        return
    students[name][subject] = grade
    print("Grade added.")

def letter_grade(avg):
    if avg >= 90:
        return "A"
    elif avg >= 80:
        return "B"
    elif avg >= 70:
        return "C"
    elif avg >= 60:
        return "D"
    else:
        return "F"

def view_report():
    name = input("Enter student name: ")
    if name not in students:
        print("Student not found.")
        return
    if not students[name]:
        print(f"{name} has no grades yet.")
        return
    print(f"\nReport for {name}:")
    total = 0
    for subject, grade in students[name].items():
        print(f"  {subject}: {grade}")
        total += grade
    avg = total / len(students[name])
    print(f"  Average: {avg:.1f}")
    print(f"  Letter grade: {letter_grade(avg)}")

def class_average():
    if not students:
        print("No students in the system.")
        return
    all_grades = []
    for name, subjects in students.items():
        for subject, grade in subjects.items():
            all_grades.append(grade)
    if not all_grades:
        print("No grades recorded yet.")
        return
    avg = sum(all_grades) / len(all_grades)
    print(f"Class average: {avg:.1f}")

load_data()

while True:
    print("\n--- Student Grade Tracker ---")
    print("1. Add student")
    print("2. Add grade")
    print("3. View all students")
    print("4. View student report")
    print("5. Class average")
    print("6. Save & Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        add_student()
    elif choice == "2":
        add_grade()
    elif choice == "3":
        if not students:
            print("No students yet.")
        else:
            for name, subjects in students.items():
                print(f"{name}: {len(subjects)} subject(s)")
    elif choice == "4":
        view_report()
    elif choice == "5":
        class_average()
    elif choice == "6":
        save_data()
        print("Data saved. Goodbye!")
        break
    else:
        print("Invalid choice.")
