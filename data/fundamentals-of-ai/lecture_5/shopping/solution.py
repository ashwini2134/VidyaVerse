import csv

from sklearn.neighbors import KNeighborsClassifier

MONTHS = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "June": 5,
    "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11,
}


def load_data(filename):
    evidence = []
    labels = []
    with open(filename) as file:
        reader = csv.DictReader(file)
        for row in reader:
            evidence.append([
                int(row["Administrative"]),
                float(row["Administrative_Duration"]),
                int(row["Informational"]),
                float(row["Informational_Duration"]),
                int(row["ProductRelated"]),
                float(row["ProductRelated_Duration"]),
                float(row["BounceRates"]),
                float(row["ExitRates"]),
                float(row["PageValues"]),
                float(row["SpecialDay"]),
                MONTHS[row["Month"]],
                int(row["OperatingSystems"]),
                int(row["Browser"]),
                int(row["Region"]),
                int(row["TrafficType"]),
                1 if row["VisitorType"] == "Returning_Visitor" else 0,
                1 if row["Weekend"] == "TRUE" else 0,
            ])
            labels.append(1 if row["Revenue"] == "TRUE" else 0)
    return evidence, labels


def train_model(evidence, labels):
    return KNeighborsClassifier(n_neighbors=1).fit(evidence, labels)


def evaluate(labels, predictions):
    positive = sum(1 for label in labels if label == 1)
    negative = sum(1 for label in labels if label == 0)
    true_positive = sum(
        1 for label, pred in zip(labels, predictions) if label == 1 and pred == 1
    )
    true_negative = sum(
        1 for label, pred in zip(labels, predictions) if label == 0 and pred == 0
    )
    sensitivity = true_positive / positive if positive else 0.0
    specificity = true_negative / negative if negative else 0.0
    return sensitivity, specificity
