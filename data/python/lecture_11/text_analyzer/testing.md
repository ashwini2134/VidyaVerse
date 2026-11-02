# Testing

Test with different inputs:

1. **Simple sentence:** "Hello world." — verify 2 words, 1 sentence, 2 unique words.
2. **Multiple sentences:** "I love Python. Python is great! Do you agree?" — verify word count, sentence count.
3. **Repeated words:** "the cat and the dog and the bird" — verify "the" is most common (3 times).
4. **Multi-line:** Enter several lines, type "done" — verify all lines are included.
5. **Empty input:** Type "done" immediately — verify it handles gracefully (division by zero protection).
