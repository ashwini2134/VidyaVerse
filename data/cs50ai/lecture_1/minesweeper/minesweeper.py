import random


class Minesweeper():
    """
    Minesweeper game representation
    """

    def __init__(self, height=8, width=8, mines=8):

        # Set initial width, height, and number of mines
        self.height = height
        self.width = width
        self.mines = set()

        # Initialize an empty field with no mines
        self.board = []
        for i in range(self.height):
            row = []
            for j in range(self.width):
                row.append(False)
            self.board.append(row)

        # Add mines randomly
        while len(self.mines) != mines:
            i = random.randrange(height)
            j = random.randrange(width)
            if not self.board[i][j]:
                self.mines.add((i, j))
                self.board[i][j] = True

        # At first, player has found no mines
        self.mines_found = set()

    def print(self):
        """
        Prints a text-based representation
        of where mines are located.
        """
        for i in range(self.height):
            print("--" * self.width + "-")
            for j in range(self.width):
                if self.board[i][j]:
                    print("|X", end="")
                else:
                    print("| ", end="")
            print("|")
        print("--" * self.width + "-")

    def is_mine(self, cell):
        i, j = cell
        return self.board[i][j]

    def nearby_mines(self, cell):
        """
        Returns the number of mines that are
        within one row and column of a given cell,
        not including the cell itself.
        """

        # Keep count of nearby mines
        count = 0

        # Loop over all cells within one row and column
        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):

                # Ignore the cell itself
                if (i, j) == cell:
                    continue

                # Update count if cell in bounds and is mine
                if 0 <= i < self.height and 0 <= j < self.width:
                    if self.board[i][j]:
                        count += 1

        return count

    def won(self):
        """
        Checks if all mines have been flagged.
        """
        return self.mines_found == self.mines


class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    def known_mines(self):
        """
        Returns the set of all cells in self.cells known to be mines.
        """
        known_mines = set()
        if self.count == len(self.cells):
            known_mines = self.cells
        return known_mines

    def known_safes(self):
        """
        Returns the set of all cells in self.cells known to be safe.
        """
        known_safes = set()
        if self.count == 0:
            known_safes = self.cells
        return known_safes

    def mark_mine(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be a mine.
        """
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be safe.
        """
        if cell in self.cells:
            self.cells.remove(cell)


class MinesweeperAI():
    """
    Minesweeper game player
    """

    def __init__(self, height=8, width=8):

        # Set initial height and width
        self.height = height
        self.width = width

        # Keep track of which cells have been clicked on
        self.moves_made = set()

        # Keep track of cells known to be safe or mines
        self.mines = set()
        self.safes = set()

        # List of sentences about the game known to be true
        self.knowledge = []

    def mark_mine(self, cell):
        """
        Marks a cell as a mine, and updates all knowledge
        to mark that cell as a mine as well.
        """
        self.mines.add(cell)
        for sentence in self.knowledge:
            sentence.mark_mine(cell)

    def mark_safe(self, cell):
        """
        Marks a cell as safe, and updates all knowledge
        to mark that cell as safe as well.
        """
        self.safes.add(cell)
        for sentence in self.knowledge:
            sentence.mark_safe(cell)

    def add_knowledge(self, cell, count):
        """
        Updates the AI's knowledge base based on a move.
        """
        self.moves_made.add(cell)
        self.mark_safe(cell)

        # Build set of neighbors, adjusting count for known mines
        neighbors = set()
        for i in range(max(0, cell[0] - 1), min(cell[0] + 2, self.height)):
            for j in range(max(0, cell[1] - 1), min(cell[1] + 2, self.width)):
                if (i, j) == cell:
                    continue
                if (i, j) in self.mines:
                    count -= 1
                elif (i, j) not in self.safes:
                    neighbors.add((i, j))

        # Add the new sentence to knowledge
        new_sentence = Sentence(neighbors, count)
        self.knowledge.append(new_sentence)

        # Loop until no more inferences can be made
        while True:
            knowledge_changed = False

            # Collect all new safes and mines found in the KB
            new_safes = set()
            new_mines = set()
            for sentence in self.knowledge:
                new_safes.update(sentence.known_safes())
                new_mines.update(sentence.known_mines())

            # If we found any, mark them and note the change
            if new_safes:
                knowledge_changed = True
                for safe in new_safes:
                    self.mark_safe(safe)
            if new_mines:
                knowledge_changed = True
                for mine in new_mines:
                    self.mark_mine(mine)

            # Remove empty sentences
            self.knowledge = [s for s in self.knowledge if s.cells != set()]

            # Inference by subsets
            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1 != s2 and s1.cells.issubset(s2.cells):
                        inferred_cells = s2.cells - s1.cells
                        inferred_count = s2.count - s1.count
                        new_inferred_sentence = Sentence(inferred_cells, inferred_count)

                        if new_inferred_sentence not in self.knowledge:
                            self.knowledge.append(new_inferred_sentence)
                            knowledge_changed = True

            # If nothing changed in this pass, we are done
            if not knowledge_changed:
                break

    def make_safe_move(self):
        """
        Returns a safe cell to choose on the Minesweeper board.
        The move must be known to be safe, and not already a move
        that has been made.

        This function may use the knowledge in self.mines, self.safes
        and self.moves_made, but should not modify any of those values.
        """

        available_moves = self.safes - self.moves_made
        if available_moves:
            return random.choice(tuple(available_moves))
        return None

    def make_random_move(self):
            """
            Returns a move to make on the Minesweeper board.
            """
            # Collect all possible coordinates
            possible_moves = []
            for i in range(self.height):
                for j in range(self.width):
                    if (i, j) not in self.moves_made and (i, j) not in self.mines:
                        possible_moves.append((i, j))

            if not possible_moves:
                return None

            return random.choice(possible_moves)
