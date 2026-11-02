# Specification

## Requirements

1. Display a menu with options 1-6.
2. **Add student:** Prompt for a name and add them to the system.
3. **Add grade:** Prompt for student name, subject, and grade (0-100). Validate input.
4. **View all students:** Display all students and their subject count.
5. **View student report:** Show a single student's grades, average, and letter grade.
6. **Class average:** Show the average across all students and all subjects.
7. **Save & Exit:** Save data to a file named `grades.txt` and exit.
8. On startup, automatically load any saved data from `grades.txt`.

## Constraints

- Use a dictionary where keys are student names and values are dictionaries of `{subject: grade}`.
- Define the letter grade mapping:
  - A: 90-100
  - B: 80-89
  - C: 70-79
  - D: 60-69
  - F: 0-59
- Use functions to organize the code: `add_student()`, `add_grade()`, `view_report()`, `load_data()`, `save_data()`, etc.
- Validate that grades are numbers between 0 and 100.
- Handle the case where the save file doesn't exist on first run.
