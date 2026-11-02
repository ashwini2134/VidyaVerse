# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
"""
Tic Tac Toe Player
"""
import copy
import math

X = "X"
O = "O"
EMPTY = None


def initial_state():
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    if board == initial_state():
        return X
    total = sum(row.count(X) + row.count(O) for row in board)
    return O if total % 2 == 1 else X


def actions(board):
    return {
        (i, j)
        for i in range(3)
        for j in range(3)
        if board[i][j] is EMPTY
    }


def result(board, action):
    if action not in actions(board):
        raise Exception("Invalid action")
    i, j = action
    new_board = copy.deepcopy(board)
    new_board[i][j] = player(board)
    return new_board


def winner(board):
    lines = []
    lines.extend(board)                                  # rows
    lines.extend([[board[r][c] for r in range(3)] for c in range(3)])  # cols
    lines.append([board[i][i] for i in range(3)])        # main diagonal
    lines.append([board[i][2 - i] for i in range(3)])    # anti-diagonal
    for line in lines:
        if line[0] is not EMPTY and line[0] == line[1] == line[2]:
            return line[0]
    return None


def terminal(board):
    if winner(board) is not None:
        return True
    return all(cell is not EMPTY for row in board for cell in row)


def utility(board):
    champ = winner(board)
    if champ == X:
        return 1
    if champ == O:
        return -1
    return 0


def minimax(board):
    if terminal(board):
        return None
    if player(board) == X:
        return _max_value(board)[1]
    return _min_value(board)[1]


def _max_value(board):
    if terminal(board):
        return utility(board), None
    best, move = -math.inf, None
    for action in actions(board):
        value = _min_value(result(board, action))[0]
        if value > best:
            best, move = value, action
            if best == 1:
                break
    return best, move


def _min_value(board):
    if terminal(board):
        return utility(board), None
    best, move = math.inf, None
    for action in actions(board):
        value = _max_value(result(board, action))[0]
        if value < best:
            best, move = value, action
            if best == -1:
                break
    return best, move
