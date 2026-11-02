# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
# Only shortest_path is implemented by the student; the rest of degrees.py
# (load_data, main, person_id_for_name, neighbors_for_person) is distribution code.
from util import Node, QueueFrontier


def shortest_path(source, target):
    """
    Returns the shortest list of (movie_id, person_id) pairs
    that connect the source to the target. Returns None if no path.
    """
    if source == target:
        return []

    start = Node(state=source, parent=None, action=None)
    frontier = QueueFrontier()
    frontier.add(start)
    explored = set()

    while True:
        if frontier.empty():
            return None

        node = frontier.remove()
        explored.add(node.state)

        for action, state in neighbors_for_person(node.state):
            if not frontier.contains_state(state) and state not in explored:
                child = Node(state=state, parent=node, action=action)
                # Check for the goal as we add to the frontier (more efficient).
                if child.state == target:
                    solution = []
                    while child.parent is not None:
                        solution.append((child.action, child.state))
                        child = child.parent
                    solution.reverse()
                    return solution
                frontier.add(child)
