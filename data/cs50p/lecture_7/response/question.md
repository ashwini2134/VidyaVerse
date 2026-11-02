# Response Validation

When creating a Google Form, it's possible to require that a user's input match a regular expression — for instance, to require a valid email address.

In a file called `response.py`, using either `validator-collection` or `validators` from PyPI, implement a program that prompts the user for an email address via `input` and then prints `Valid` or `Invalid`, respectively, if the input is a syntactically valid email address. You may not use `re`. Do not validate whether the email address's domain name actually exists.

> Uses the third-party `validators` module (`pip install validators`).

## How to Test

- `malan@harvard.edu` → `Valid`
- `malan@@@harvard.edu` → `Invalid`

```
check50 cs50/problems/2022/python/response
```
