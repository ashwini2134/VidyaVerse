# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
# Only the Sentence methods and MinesweeperAI methods below are implemented by
# the student; the Minesweeper class is distribution code.
import random


class Sentence():
    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    def known_mines(self):
        if self.count == len(self.cells):
            return set(self.cells)
        return set()

    def known_safes(self):
        if self.count == 0:
            return set(self.cells)
        return set()

    def mark_mine(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)


class MinesweeperAI():
    def __init__(self, height=8, width=8):
        self.height = height
        self.width = width
        self.moves_made = set()
        self.mines = set()
        self.safes = set()
        self.knowledge = []

    def mark_mine(self, cell):
        self.mines.add(cell)
        for sentence in self.knowledge:
            sentence.mark_mine(cell)

    def mark_safe(self, cell):
        self.safes.add(cell)
        for sentence in self.knowledge:
            sentence.mark_safe(cell)

    def add_knowledge(self, cell, count):
        self.moves_made.add(cell)
        self.mark_safe(cell)

        # Build the set of undetermined neighbors, adjusting count for known mines.
        neighbors = set()
        for i in range(max(0, cell[0] - 1), min(cell[0] + 2, self.height)):
            for j in range(max(0, cell[1] - 1), min(cell[1] + 2, self.width)):
                if (i, j) == cell:
                    continue
                if (i, j) in self.mines:
                    count -= 1
                elif (i, j) not in self.safes:
                    neighbors.add((i, j))

        self.knowledge.append(Sentence(neighbors, count))

        # Iterate until no new conclusions can be drawn.
        while True:
            changed = False

            new_safes = set()
            new_mines = set()
            for sentence in self.knowledge:
                new_safes |= sentence.known_safes()
                new_mines |= sentence.known_mines()
            for safe in new_safes - self.safes:
                self.mark_safe(safe)
                changed = True
            for mine in new_mines - self.mines:
                self.mark_mine(mine)
                changed = True

            self.knowledge = [s for s in self.knowledge if s.cells]

            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1 != s2 and s1.cells and s1.cells.issubset(s2.cells):
                        inferred = Sentence(s2.cells - s1.cells, s2.count - s1.count)
                        if inferred not in self.knowledge:
                            self.knowledge.append(inferred)
                            changed = True

            if not changed:
                break

    def make_safe_move(self):
        moves = self.safes - self.moves_made
        return next(iter(moves)) if moves else None

    def make_random_move(self):
        choices = [
            (i, j)
            for i in range(self.height)
            for j in range(self.width)
            if (i, j) not in self.moves_made and (i, j) not in self.mines
        ]
        return random.choice(choices) if choices else None
