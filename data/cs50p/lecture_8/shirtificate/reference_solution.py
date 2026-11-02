# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
from fpdf import FPDF


def main():
    name = input("Name: ").strip()

    pdf = FPDF(orientation="P", unit="mm", format="A4")
    pdf.add_page()
    pdf.set_auto_page_break(False)

    # Title, centered horizontally
    pdf.set_font("Helvetica", "B", 24)
    pdf.cell(0, 30, "CS50 Shirtificate", align="C", new_x="LMARGIN", new_y="NEXT")

    # Shirt image, centered horizontally
    image_width = 150
    x = (210 - image_width) / 2
    y = pdf.get_y() + 10
    pdf.image("shirtificate.png", x=x, y=y, w=image_width)

    # Name in white, on top of the shirt
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(x, y + image_width / 2)
    pdf.cell(image_width, 10, name, align="C")

    pdf.output("shirtificate.pdf")


if __name__ == "__main__":
    main()
