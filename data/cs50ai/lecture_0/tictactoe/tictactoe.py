```python
"""
Tic Tac Toe Player
"""
import copy
import math

X = "X"
O = "O"
EMPTY = None

def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]

def player(board):
    """
    Returns player who has the next turn on a board.
    """
    if board == initial_state():
        return X

    total = 0
    for row in board:
        total += row.count(X) + row.count(O)
    if total % 2 == 1:
        return O
    return X

def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    actions_set = set()
    for row in range(len(board)):
        for col in range(len(board[row])):
            if board[row][col] is EMPTY:
                actions_set.add((row, col))
    return actions_set

def result(board, action):
    if action is None:
        raise Exception("Action cannot be None")

    row, col = action

    # Check bounds (0, 1, or 2)
    if not (0 <= row < 3 and 0 <= col < 3):
        raise Exception("Move is out of bounds")

    # Check if cell is empty
    if board[row][col] is not EMPTY:
        raise Exception("Invalid move: Cell already occupied")

    new_board = copy.deepcopy(board)
    new_board[row][col] = player(board)

    return new_board

def winner(board):
    # Check Rows
    for row in board:
        # Only return the winner if the first cell isn't empty
        if row[0] is not EMPTY and row[0] == row[1] == row[2]:
            return row[0]

    # Check Columns
    for col in range(3):
        if board[0][col] is not EMPTY and board[0][col] == board[1][col] == board[2][col]:
            return board[0][col]

    # Check Left-to-Right Diagonal
    if board[0][0] is not EMPTY and board[0][0] == board[1][1] == board[2][2]:
        return board[0][0]

    # Check Right-to-Left Diagonal
    if board[0][2] is not EMPTY and board[0][2] == board[1][1] == board[2][0]:
        return board[0][2]

    return None

def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    is_full = True
    for row in board:
        if EMPTY in row:
            is_full = False
            break
    if is_full:
        return True

    return winner(board) is not None

def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    victor = winner(board)
    if victor == X:
        return 1
    elif victor == O:
        return -1

    return 0

def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    if terminal(board):
        return None
    if player(board) == X:
        return maximize(board)[1]
    return minimize(board)[1]

def maximize(board):
    if terminal(board):
        return [utility(board), None]
    best_score = -math.inf
    best_move = None
    for move in actions(board):
        score = max(best_score, minimize(result(board, move))[0])
        if score > best_score:
            best_score = score
            best_move = move
    return [best_score, best_move]

def minimize(board):
    if terminal(board):
        return [utility(board), None]
    best_score = math.inf
    best_move = None
    for move in actions(board):
        score = min(best_score, maximize(result(board, move))[0])
        if score < best_score:
            best_score = score
            best_move = move
    return [best_score, best_move]

```