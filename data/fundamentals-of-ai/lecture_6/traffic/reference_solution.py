# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
# Only load_data and get_model are implemented by the student; main and the
# global constants (EPOCHS, IMG_WIDTH, IMG_HEIGHT, NUM_CATEGORIES, TEST_SIZE)
# are distribution code.
import os

import cv2
import tensorflow as tf

IMG_WIDTH = 30
IMG_HEIGHT = 30
NUM_CATEGORIES = 43


def load_data(data_dir):
    images = []
    labels = []
    for category in range(NUM_CATEGORIES):
        folder = os.path.join(data_dir, str(category))
        if not os.path.isdir(folder):
            continue
        for filename in os.listdir(folder):
            image = cv2.imread(os.path.join(folder, filename))
            image = cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT))
            images.append(image)
            labels.append(category)
    return images, labels


def get_model():
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(
            32, (3, 3), activation="relu", input_shape=(IMG_WIDTH, IMG_HEIGHT, 3)
        ),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(NUM_CATEGORIES, activation="softmax"),
    ])
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model
