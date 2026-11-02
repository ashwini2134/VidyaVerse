# Watch on YouTube

YouTube videos can be embedded in other sites via an `<iframe>` whose `src` attribute is a URL like `https://www.youtube.com/embed/xvFZjo5PgG0`.

In a file called `watch.py`, implement a function called `parse` that expects a `str` of HTML as input, extracts any YouTube URL that's the value of a `src` attribute of an `iframe` element therein, and returns its shorter, shareable `youtu.be` equivalent as a `str`. Assume the value of `src` is surrounded by double quotes and that the input contains no more than one such URL. If the input does not contain any such URL, return `None`.

Expected `src` formats:

- `http://youtube.com/embed/xvFZjo5PgG0`
- `https://youtube.com/embed/xvFZjo5PgG0`
- `https://www.youtube.com/embed/xvFZjo5PgG0`

## How to Test

- `<iframe src="http://www.youtube.com/embed/xvFZjo5PgG0"></iframe>` → `https://youtu.be/xvFZjo5PgG0`
- `<iframe src="https://cs50.harvard.edu/python"></iframe>` → `None`

```
check50 cs50/problems/2022/python/watch
```
