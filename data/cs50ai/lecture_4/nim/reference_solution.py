# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
# Only the four NimAI methods below are implemented by the student; the Nim
# class and train/play functions are distribution code.
import random


def get_q_value(self, state, action):
    return self.q.get((tuple(state), action), 0)


def update_q_value(self, state, action, old_q, reward, future_rewards):
    self.q[(tuple(state), action)] = old_q + self.alpha * (
        reward + future_rewards - old_q
    )


def best_future_reward(self, state):
    actions = Nim.available_actions(state)
    if not actions:
        return 0
    return max(self.get_q_value(state, action) for action in actions)


def choose_action(self, state, epsilon=True):
    actions = list(Nim.available_actions(state))
    if not actions:
        return None

    best_action = max(actions, key=lambda action: self.get_q_value(state, action))

    if epsilon and random.random() < self.epsilon:
        return random.choice(actions)
    return best_action
