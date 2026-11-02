PROBS = {
    "gene": {2: 0.01, 1: 0.03, 0: 0.96},
    "trait": {
        2: {True: 0.65, False: 0.35},
        1: {True: 0.56, False: 0.44},
        0: {True: 0.01, False: 0.99},
    },
    "mutation": 0.01,
}


def _pass_probability(parent, one_gene, two_genes):
    if parent in two_genes:
        return 1 - PROBS["mutation"]
    if parent in one_gene:
        return 0.5
    return PROBS["mutation"]


def joint_probability(people, one_gene, two_genes, have_trait):
    probability = 1
    for person in people:
        genes = 2 if person in two_genes else 1 if person in one_gene else 0
        trait = person in have_trait

        mother = people[person]["mother"]
        father = people[person]["father"]

        if not mother and not father:
            probability *= PROBS["gene"][genes]
        else:
            m = _pass_probability(mother, one_gene, two_genes)
            f = _pass_probability(father, one_gene, two_genes)
            if genes == 2:
                probability *= m * f
            elif genes == 1:
                probability *= m * (1 - f) + f * (1 - m)
            else:
                probability *= (1 - m) * (1 - f)

        probability *= PROBS["trait"][genes][trait]

    return probability


def update(probabilities, one_gene, two_genes, have_trait, p):
    for person in probabilities:
        genes = 2 if person in two_genes else 1 if person in one_gene else 0
        probabilities[person]["gene"][genes] += p
        probabilities[person]["trait"][person in have_trait] += p


def normalize(probabilities):
    for person in probabilities:
        for field in ("gene", "trait"):
            total = sum(probabilities[person][field].values())
            if total:
                for value in probabilities[person][field]:
                    probabilities[person][field][value] /= total
