import random


def transition_model(corpus, page, damping_factor):
    distribution = {}
    num_pages = len(corpus)
    links = corpus[page]

    if not links:
        return {name: 1 / num_pages for name in corpus}

    for name in corpus:
        distribution[name] = (1 - damping_factor) / num_pages
        if name in links:
            distribution[name] += damping_factor / len(links)
    return distribution


def sample_pagerank(corpus, damping_factor, n):
    ranks = {name: 0 for name in corpus}
    page = random.choice(list(corpus))
    ranks[page] += 1 / n
    for _ in range(n - 1):
        model = transition_model(corpus, page, damping_factor)
        page = random.choices(list(model), weights=list(model.values()), k=1)[0]
        ranks[page] += 1 / n
    return ranks


def iterate_pagerank(corpus, damping_factor):
    n = len(corpus)
    ranks = {name: 1 / n for name in corpus}
    random_factor = (1 - damping_factor) / n

    while True:
        new_ranks = {}
        for page in corpus:
            total = 0
            for other, links in corpus.items():
                if page in links:
                    total += ranks[other] / len(links)
                elif not links:
                    total += ranks[other] / n
            new_ranks[page] = random_factor + damping_factor * total

        if max(abs(new_ranks[p] - ranks[p]) for p in corpus) < 0.001:
            return new_ranks
        ranks = new_ranks
