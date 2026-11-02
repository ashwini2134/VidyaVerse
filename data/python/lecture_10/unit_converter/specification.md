# Specification

## Requirements

1. Display a main menu with 4 conversion categories and Exit.
2. Each category has a submenu with two conversion directions.
3. Define a separate function for each conversion direction (8 functions total):
   - `celsius_to_fahrenheit(c)` and `fahrenheit_to_celsius(f)`
   - `km_to_miles(km)` and `miles_to_km(miles)`
   - `kg_to_pounds(kg)` and `pounds_to_kg(pounds)`
   - `hours_to_minutes(h)` and `minutes_to_hours(min)`
4. Each function takes a number and returns the converted value.
5. The main program uses these functions to perform conversions based on user input.
6. Display results with one decimal place.

## Formulas

- Celsius to Fahrenheit: `(c * 9/5) + 32`
- Fahrenheit to Celsius: `(f - 32) * 5/9`
- km to miles: `km * 0.621371`
- miles to km: `miles / 0.621371`
- kg to pounds: `kg * 2.20462`
- pounds to kg: `pounds / 2.20462`
- hours to minutes: `h * 60`
- minutes to hours: `min / 60`

## Constraints

- Each conversion must be implemented as a separate function with a `return` statement.
- Use `float(input(...))` to read numeric input.
- Handle invalid menu choices.
