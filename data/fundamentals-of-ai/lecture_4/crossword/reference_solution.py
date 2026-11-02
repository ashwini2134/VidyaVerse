# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
# Only the eight functions below are implemented by the student inside
# generate.py's CrosswordCreator; crossword.py and the I/O helpers are
# distribution code.

def enforce_node_consistency(self):
    for var in self.crossword.variables:
        for word in set(self.domains[var]):
            if len(word) != var.length:
                self.domains[var].remove(word)


def revise(self, x, y):
    overlap = self.crossword.overlaps[x, y]
    if overlap is None:
        return False
    i, j = overlap
    revised = False
    for word_x in set(self.domains[x]):
        if not any(word_x[i] == word_y[j] for word_y in self.domains[y]):
            self.domains[x].remove(word_x)
            revised = True
    return revised


def ac3(self, arcs=None):
    if arcs is None:
        queue = [(x, y) for x in self.crossword.variables
                 for y in self.crossword.neighbors(x)]
    else:
        queue = list(arcs)

    while queue:
        x, y = queue.pop(0)
        if self.revise(x, y):
            if not self.domains[x]:
                return False
            for z in self.crossword.neighbors(x) - {y}:
                queue.append((z, x))
    return True


def assignment_complete(self, assignment):
    return set(assignment.keys()) == self.crossword.variables and all(assignment.values())


def consistent(self, assignment):
    used = set()
    for var, word in assignment.items():
        if len(word) != var.length:
            return False
        if word in used:
            return False
        used.add(word)
        for neighbor in self.crossword.neighbors(var):
            if neighbor in assignment:
                i, j = self.crossword.overlaps[var, neighbor]
                if word[i] != assignment[neighbor][j]:
                    return False
    return True


def order_domain_values(self, var, assignment):
    def eliminated(word):
        count = 0
        for neighbor in self.crossword.neighbors(var):
            if neighbor in assignment:
                continue
            i, j = self.crossword.overlaps[var, neighbor]
            for other in self.domains[neighbor]:
                if word[i] != other[j]:
                    count += 1
        return count

    return sorted(self.domains[var], key=eliminated)


def select_unassigned_variable(self, assignment):
    unassigned = [v for v in self.crossword.variables if v not in assignment]
    return min(
        unassigned,
        key=lambda v: (len(self.domains[v]), -len(self.crossword.neighbors(v))),
    )


def backtrack(self, assignment):
    if self.assignment_complete(assignment):
        return assignment
    var = self.select_unassigned_variable(assignment)
    for value in self.order_domain_values(var, assignment):
        assignment[var] = value
        if self.consistent(assignment):
            result = self.backtrack(assignment)
            if result is not None:
                return result
        del assignment[var]
    return None
