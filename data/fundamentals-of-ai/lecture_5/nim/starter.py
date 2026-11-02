class NimAI():

    def get_q_value(self, state, action):

        # TODO
        raise NotImplementedError

    def update_q_value(
        self,
        state,
        action,
        old_q,
        reward,
        future_rewards
    ):

        # TODO
        raise NotImplementedError

    def best_future_reward(self, state):

        # TODO
        raise NotImplementedError

    def choose_action(
        self,
        state,
        epsilon=True
    ):

        # TODO
        raise NotImplementedError