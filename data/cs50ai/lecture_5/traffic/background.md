As research continues in the development of self-driving cars, one of the key challenges is [computer vision](https://en.wikipedia.org/wiki/Computer_vision), allowing these cars to develop an understanding of their environment from digital images. In particular, this involves the ability to recognize and distinguish road signs – stop signs, speed limit signs, yield signs, and more.

In this project, you’ll use [TensorFlow](https://www.tensorflow.org/) to build a neural network to classify road signs based on an image of those signs. To do so, you’ll need a labeled dataset: a collection of images that have already been categorized by the road sign represented in them.

Several such data sets exist, but for this project, we’ll use the [German Traffic Sign Recognition Benchmark](https://benchmark.ini.rub.de/?section=gtsrb&subsection=news) (GTSRB) dataset, which contains thousands of images of 43 different kinds of road signs.

## [Getting Started](https://cs50.harvard.edu/ai/projects/5/traffic/#getting-started)

- Download the distribution code from https://cdn.cs50.net/ai/2023/x/projects/5/traffic.zip and unzip it.
- Download the [data set](https://cdn.cs50.net/ai/2023/x/projects/5/gtsrb.zip) for this project and unzip it. Move the resulting `gtsrb` directory inside of your `traffic` directory.
- Inside of the `traffic` directory, run `pip3 install -r requirements.txt` to install this project’s dependencies: `opencv-python` for image processing, `scikit-learn` for ML-related functions, and `tensorflow` for neural networks.