
# Hints

- While the implementation of search in lecture checks for a goal when a node is popped off the frontier, you can improve the efficiency of your search by checking for a goal as nodes are added to the frontier.

- If you detect a goal node, there is no need to add it to the frontier. You can simply return the solution immediately.

- You’re welcome to borrow and adapt any code from the lecture examples.

- We’ve already provided you with a file `util.py` that contains the lecture implementations for:

  - `Node`
  - `StackFrontier`
  - `QueueFrontier`