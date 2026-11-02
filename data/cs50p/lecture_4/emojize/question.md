# Emojize

Because emoji aren't quite as easy to type as text, some programs support "codes," whereby you can type, for instance, `:thumbs_up:`, which will be automatically converted to 👍. Some programs additionally support aliases, e.g. `:thumbsup:`.

In a file called `emojize.py`, implement a program that prompts the user for a `str` in English and then outputs the "emojized" version of that `str`, converting any codes (or aliases) therein to their corresponding emoji.

> Uses the third-party `emoji` module (`pip install emoji`), whose `emojize` function takes an optional named parameter `language`.

## How to Test

- `:1st_place_medal:` → 🥇
- `:money_bag:` → 💰
- `:smile_cat:` → 😸

```
check50 cs50/problems/2022/python/emojize
```
