# REFERENCE SOLUTION - DO NOT SHIP TO STUDENTS
# Only get_mask_token_index, get_color_for_attention_score, and
# visualize_attentions are implemented by the student; main and
# generate_diagram are distribution code.


def get_mask_token_index(mask_token_id, inputs):
    for index, token_id in enumerate(inputs["input_ids"][0]):
        if token_id == mask_token_id:
            return index
    return None


def get_color_for_attention_score(attention_score):
    shade = round(float(attention_score) * 255)
    return (shade, shade, shade)


def visualize_attentions(tokens, attentions):
    for i, layer in enumerate(attentions):
        for k in range(len(layer[0])):
            generate_diagram(i + 1, k + 1, tokens, attentions[i][0][k])
