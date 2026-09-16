def evaluate_answer(question, answer):
    """
    Basic AI-style evaluation of a user's interview answer.
    """

    answer = answer.strip()

    if not answer:
        return {
            "score": 0,
            "feedback": "No answer was provided.",
            "strengths": [],
            "improvements": [
                "Provide a clear and detailed answer to the question."
            ]
        }

    word_count = len(answer.split())

    # Basic scoring
    if word_count < 5:
        score = 30
        feedback = (
            "Your answer is too short. Try explaining your answer "
            "with more details and examples."
        )
        strengths = ["Attempted to answer the question."]
        improvements = [
            "Provide more details.",
            "Use examples where possible.",
            "Explain your answer clearly."
        ]

    elif word_count < 20:
        score = 60
        feedback = (
            "Your answer is understandable, but it could include "
            "more explanation and examples."
        )
        strengths = [
            "Answer is relevant to the question.",
            "Basic explanation was provided."
        ]
        improvements = [
            "Add more technical details.",
            "Include an example.",
            "Structure your answer more clearly."
        ]

    elif word_count < 50:
        score = 80
        feedback = (
            "Good answer. You provided a reasonable explanation. "
            "Adding more specific examples could make it stronger."
        )
        strengths = [
            "Good explanation.",
            "Answer contains useful details.",
            "Good response length."
        ]
        improvements = [
            "Include real-world examples.",
            "Mention relevant technical concepts."
        ]

    else:
        score = 95
        feedback = (
            "Excellent answer. Your response is detailed and well explained."
        )
        strengths = [
            "Detailed explanation.",
            "Good response length.",
            "Shows strong understanding of the topic."
        ]
        improvements = [
            "Keep answers structured and focused."
        ]

    return {
        "score": score,
        "feedback": feedback,
        "strengths": strengths,
        "improvements": improvements
    }