import re


# =========================================================
# STOP WORDS
# =========================================================

STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "to", "of",
    "in", "on", "for", "with", "is", "are", "was",
    "were", "be", "been", "being", "i", "me", "my",
    "we", "our", "you", "your", "it", "this", "that",
    "they", "their", "from", "as", "at", "by", "how",
    "what", "why", "when", "where", "which", "would",
    "could", "should", "can", "do", "did", "does",
    "tell", "about", "explain", "describe"
}


# =========================================================
# BASIC TEXT HELPERS
# =========================================================

def normalize_text(text):
    if not isinstance(text, str):
        return ""

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9+#.\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def get_words(text):
    normalized = normalize_text(text)

    words = normalized.split()

    return [
        word
        for word in words
        if len(word) > 2
        and word not in STOP_WORDS
    ]


def count_words(text):
    return len(
        str(text).split()
    )


# =========================================================
# GIBBERISH / MEANINGFUL ANSWER DETECTION
# =========================================================

def is_meaningful_answer(answer):
    """
    Detect obvious meaningless/gibberish answers.

    This is intentionally conservative. It does not try
    to decide whether an answer is factually correct.
    It only identifies answers that clearly contain
    insufficient meaningful language.
    """

    if not isinstance(answer, str):
        return False

    answer = answer.strip()

    if not answer:
        return False

    words = answer.split()

    if len(words) < 3:
        return False

    meaningful_words = get_words(answer)

    if len(meaningful_words) < 2:
        return False

    # -----------------------------------------------------
    # Detect words containing long random character runs
    # -----------------------------------------------------

    random_word_count = 0

    for word in words:

        cleaned = re.sub(
            r"[^a-zA-Z]",
            "",
            word
        )

        if len(cleaned) >= 7:

            vowel_count = sum(
                1
                for char in cleaned.lower()
                if char in "aeiou"
            )

            consonant_count = (
                len(cleaned)
                - vowel_count
            )

            # Very unusual long consonant sequences
            if (
                vowel_count == 0
                and consonant_count >= 5
            ):
                random_word_count += 1

            # Repeated character patterns
            if re.search(
                r"(.)\1{3,}",
                cleaned.lower()
            ):
                random_word_count += 1

    if random_word_count >= 1:
        return False

    # -----------------------------------------------------
    # Detect answers that are almost entirely random
    # -----------------------------------------------------

    alphabetic_chars = re.findall(
        r"[a-zA-Z]",
        answer
    )

    if not alphabetic_chars:
        return False

    # Require enough alphabetic content
    if len(alphabetic_chars) < 5:
        return False

    return True


# =========================================================
# PRACTICAL EXAMPLE DETECTION
# =========================================================

def has_example(answer):

    normalized = normalize_text(
        answer
    )

    example_terms = [
        "example",
        "for example",
        "such as",
        "for instance",
        "project",
        "when i worked",
        "i worked on",
        "in my project",
        "in a project",
        "real world",
        "real-world",
        "experience",
        "implemented",
        "developed",
        "built",
        "created"
    ]

    return any(
        term in normalized
        for term in example_terms
    )


# =========================================================
# STRUCTURE DETECTION
# =========================================================

def has_structure(answer):

    normalized = normalize_text(
        answer
    )

    structure_terms = [
        "first",
        "second",
        "third",
        "then",
        "next",
        "finally",
        "because",
        "therefore",
        "however",
        "step",
        "steps",
        "approach",
        "process",
        "result"
    ]

    matches = sum(
        1
        for term in structure_terms
        if term in normalized
    )

    return matches >= 2


# =========================================================
# TECHNICAL TERMS
# =========================================================

TECHNICAL_TERMS = [
    "algorithm",
    "api",
    "backend",
    "frontend",
    "database",
    "sql",
    "python",
    "java",
    "javascript",
    "react",
    "flask",
    "machine learning",
    "model",
    "dataset",
    "data",
    "analysis",
    "analytics",
    "statistics",
    "query",
    "table",
    "index",
    "server",
    "client",
    "authentication",
    "authorization",
    "testing",
    "debugging",
    "deployment",
    "cloud",
    "dashboard",
    "visualization",
    "classification",
    "regression",
    "clustering",
    "feature",
    "training",
    "validation",
    "accuracy",
    "performance",
    "optimization",
    "normalization",
    "component",
    "state",
    "props",
    "join",
    "left join",
    "inner join",
    "missing values",
    "duplicate",
    "outlier",
    "correlation",
    "causation",
    "overfitting",
    "underfitting"
]


def has_technical_content(answer):

    normalized = normalize_text(
        answer
    )

    return any(
        term in normalized
        for term in TECHNICAL_TERMS
    )


# =========================================================
# QUESTION TYPE DETECTION
# =========================================================

def is_technical_question(question):

    normalized = normalize_text(
        question
    )

    technical_question_terms = [
        "sql",
        "python",
        "java",
        "javascript",
        "react",
        "database",
        "machine learning",
        "algorithm",
        "api",
        "backend",
        "frontend",
        "data",
        "dataset",
        "model",
        "query",
        "dashboard",
        "visualization",
        "testing",
        "debug",
        "performance",
        "architecture",
        "normalization",
        "index",
        "overfitting",
        "underfitting",
        "correlation",
        "causation",
        "missing values",
        "duplicate",
        "technical",
        "technology"
    ]

    return any(
        term in normalized
        for term in technical_question_terms
    )


# =========================================================
# QUESTION EXPECTED CONCEPTS
# =========================================================

QUESTION_CONCEPTS = {

    "sql": [
        "sql",
        "query",
        "database",
        "table",
        "join",
        "select",
        "where",
        "group by"
    ],

    "python": [
        "python",
        "function",
        "list",
        "dictionary",
        "loop",
        "variable",
        "exception"
    ],

    "machine learning": [
        "machine learning",
        "model",
        "training",
        "data",
        "feature",
        "prediction",
        "algorithm",
        "validation"
    ],

    "missing values": [
        "missing",
        "null",
        "remove",
        "impute",
        "mean",
        "median",
        "mode",
        "fill"
    ],

    "correlation and causation": [
        "correlation",
        "causation",
        "relationship",
        "cause",
        "effect"
    ],

    "dashboard": [
        "dashboard",
        "kpi",
        "visualization",
        "chart",
        "data",
        "business",
        "insight"
    ],

    "database": [
        "database",
        "table",
        "query",
        "sql",
        "index",
        "data",
        "schema"
    ],

    "api": [
        "api",
        "request",
        "response",
        "endpoint",
        "http",
        "server",
        "client"
    ],

    "react": [
        "react",
        "component",
        "state",
        "props",
        "hook",
        "frontend"
    ],

    "backend": [
        "backend",
        "server",
        "api",
        "database",
        "request",
        "response"
    ]
}


def find_expected_concepts(question):

    normalized = normalize_text(
        question
    )

    matched_concepts = []

    for concept, keywords in QUESTION_CONCEPTS.items():

        if concept in normalized:
            matched_concepts.extend(
                keywords
            )
            continue

        keyword_matches = sum(
            1
            for keyword in keywords
            if keyword in normalized
        )

        if keyword_matches >= 2:
            matched_concepts.extend(
                keywords
            )

    return list(
        set(matched_concepts)
    )


# =========================================================
# RELEVANCE
# =========================================================

def calculate_relevance_score(
    question,
    answer
):

    question_words = set(
        get_words(question)
    )

    answer_words = set(
        get_words(answer)
    )

    if not question_words:
        return 50

    overlap = (
        question_words
        & answer_words
    )

    ratio = (
        len(overlap)
        / len(question_words)
    )

    score = 35 + (
        ratio * 65
    )

    return round(
        min(
            100,
            max(
                0,
                score
            )
        )
    )


# =========================================================
# CONCEPT RELEVANCE
# =========================================================

def calculate_concept_score(
    question,
    answer
):

    expected = find_expected_concepts(
        question
    )

    if not expected:
        return 70

    normalized_answer = normalize_text(
        answer
    )

    matched = sum(
        1
        for concept in expected
        if concept in normalized_answer
    )

    if matched == 0:
        return 20

    ratio = (
        matched
        / len(expected)
    )

    return round(
        30 + (
            ratio * 70
        )
    )


# =========================================================
# DEPTH
# =========================================================

def calculate_depth_score(answer):

    word_count = count_words(
        answer
    )

    if word_count < 5:
        return 10

    if word_count < 15:
        return 35

    if word_count < 30:
        return 55

    if word_count < 60:
        return 72

    if word_count < 100:
        return 85

    return 92


# =========================================================
# PRACTICAL SCORE
# =========================================================

def calculate_practical_score(answer):

    if has_example(answer):
        return 90

    word_count = count_words(
        answer
    )

    if word_count >= 50:
        return 65

    if word_count >= 25:
        return 50

    return 25


# =========================================================
# STRUCTURE
# =========================================================

def calculate_structure_score(answer):

    word_count = count_words(
        answer
    )

    if word_count < 5:
        return 10

    if has_structure(answer):
        return 90

    if word_count >= 30:
        return 70

    return 55


# =========================================================
# TECHNICAL SCORE
# =========================================================

def calculate_technical_score(
    question,
    answer
):

    if not is_technical_question(
        question
    ):
        # Do not artificially give a high
        # technical score to non-technical questions.
        return 60

    if has_technical_content(
        answer
    ):
        return 85

    if count_words(answer) >= 30:
        return 50

    return 20


# =========================================================
# CLARITY
# =========================================================

def calculate_clarity_score(answer):

    if not is_meaningful_answer(
        answer
    ):
        return 0

    word_count = count_words(
        answer
    )

    if word_count < 5:
        return 20

    sentence_count = max(
        1,
        len(
            re.split(
                r"[.!?]+",
                answer
            )
        ) - 1
    )

    average_sentence_length = (
        word_count
        / sentence_count
    )

    if (
        word_count >= 20
        and average_sentence_length <= 35
    ):
        return 90

    if word_count >= 15:
        return 75

    return 60


# =========================================================
# DIFFICULTY
# =========================================================

def get_difficulty(score):

    if score >= 85:
        return "Advanced"

    if score >= 70:
        return "Intermediate"

    return "Beginner"


# =========================================================
# FEEDBACK
# =========================================================

def build_feedback(
    relevance,
    concept_score,
    technical,
    depth,
    practical,
    structure,
    clarity
):

    strengths = []
    improvements = []

    if relevance >= 75:
        strengths.append(
            "Your answer addressed the interview question."
        )

    if concept_score >= 75:
        strengths.append(
            "Your answer included concepts relevant to the question."
        )

    if technical >= 75:
        strengths.append(
            "You demonstrated relevant technical understanding."
        )

    if depth >= 75:
        strengths.append(
            "You provided a reasonably detailed explanation."
        )

    if practical >= 75:
        strengths.append(
            "You included practical experience or an example."
        )

    if structure >= 75:
        strengths.append(
            "Your answer had a clear structure."
        )

    if clarity >= 75:
        strengths.append(
            "Your explanation was reasonably clear."
        )

    if relevance < 70:
        improvements.append(
            "Focus directly on what the interviewer asked."
        )

    if concept_score < 70:
        improvements.append(
            "Include the key concepts needed to answer this question."
        )

    if technical < 70:
        improvements.append(
            "Include relevant technical concepts and explain them accurately."
        )

    if depth < 70:
        improvements.append(
            "Expand your explanation instead of giving only a short response."
        )

    if practical < 70:
        improvements.append(
            "Add a practical example, project or real-world situation."
        )

    if structure < 70:
        improvements.append(
            "Structure the answer step by step."
        )

    if clarity < 70:
        improvements.append(
            "Use clearer and more understandable sentences."
        )

    if not strengths:
        strengths.append(
            "You attempted to answer the interview question."
        )

    if not improvements:
        improvements.append(
            "Keep your answer focused and support it with specific examples."
        )

    return (
        strengths,
        improvements
    )


# =========================================================
# IMPROVEMENT GUIDANCE
# =========================================================

def build_better_answer_guidance(
    relevance,
    concept_score,
    technical,
    depth,
    practical,
    structure
):

    guidance = []

    if relevance < 70:
        guidance.append(
            "Start by directly answering the interviewer's question."
        )

    if concept_score < 70:
        guidance.append(
            "Mention the important concepts related to the question."
        )

    if technical < 70:
        guidance.append(
            "Use accurate technical terminology where appropriate."
        )

    if depth < 70:
        guidance.append(
            "Explain your reasoning instead of giving only a one-line answer."
        )

    if practical < 70:
        guidance.append(
            "Give a concrete project or real-world example."
        )

    if structure < 70:
        guidance.append(
            "Use a simple structure: approach, explanation, example and result."
        )

    if not guidance:
        guidance.append(
            "Maintain the same level of clarity and detail in your next answer."
        )

    return guidance


# =========================================================
# MAIN EVALUATOR
# =========================================================

def evaluate_answer(
    question,
    answer
):

    question = (
        question
        if isinstance(
            question,
            str
        )
        else ""
    )

    answer = (
        answer
        if isinstance(
            answer,
            str
        )
        else ""
    )

    question = question.strip()
    answer = answer.strip()

    # =====================================================
    # EMPTY ANSWER
    # =====================================================

    if not answer:

        return {
            "score": 0,

            "difficulty":
                "Beginner",

            "feedback":
                "No answer was provided.",

            "strengths": [],

            "weaknesses": [
                "No answer was provided."
            ],

            "improvements": [
                "Answer the interview question.",
                "Explain your reasoning.",
                "Include an example when appropriate."
            ],

            "better_answer_guidance": [
                "Start by directly answering the question.",
                "Explain your approach.",
                "Give a practical example."
            ],

            "analysis": {
                "relevance_score": 0,
                "concept_score": 0,
                "technical_score": 0,
                "depth_score": 0,
                "practical_score": 0,
                "structure_score": 0,
                "clarity_score": 0
            },

            "follow_up_question": None
        }

    # =====================================================
    # GIBBERISH / INVALID ANSWER
    # =====================================================

    if not is_meaningful_answer(
        answer
    ):

        return {
            "score": 0,

            "difficulty":
                "Beginner",

            "feedback":
                "The answer does not appear to contain meaningful interview content.",

            "strengths": [],

            "weaknesses": [
                "The response appears to be incomplete or meaningless.",
                "The answer does not address the interview question."
            ],

            "improvements": [
                "Provide a meaningful answer to the question.",
                "Explain the relevant concept in your own words.",
                "Give a practical example when possible."
            ],

            "better_answer_guidance": [
                "Listen to the complete question.",
                "Start with a direct answer.",
                "Explain your reasoning clearly.",
                "Add an example or experience."
            ],

            "analysis": {
                "relevance_score": 0,
                "concept_score": 0,
                "technical_score": 0,
                "depth_score": 0,
                "practical_score": 0,
                "structure_score": 0,
                "clarity_score": 0
            },

            "follow_up_question": None
        }

    # =====================================================
    # CALCULATE SCORES
    # =====================================================

    relevance_score = (
        calculate_relevance_score(
            question,
            answer
        )
    )

    concept_score = (
        calculate_concept_score(
            question,
            answer
        )
    )

    technical_score = (
        calculate_technical_score(
            question,
            answer
        )
    )

    depth_score = (
        calculate_depth_score(
            answer
        )
    )

    practical_score = (
        calculate_practical_score(
            answer
        )
    )

    structure_score = (
        calculate_structure_score(
            answer
        )
    )

    clarity_score = (
        calculate_clarity_score(
            answer
        )
    )

    # =====================================================
    # OVERALL SCORE
    # =====================================================

    score = (
        relevance_score * 0.20
        + concept_score * 0.20
        + technical_score * 0.15
        + depth_score * 0.15
        + practical_score * 0.10
        + structure_score * 0.10
        + clarity_score * 0.10
    )

    score = round(
        min(
            100,
            max(
                0,
                score
            )
        )
    )

    # -----------------------------------------------------
    # IMPORTANT QUALITY GATE
    # -----------------------------------------------------

    # If the answer is clearly unrelated to the question,
    # do not allow other dimensions to artificially push
    # the score too high.

    if (
        relevance_score < 35
        and concept_score < 35
    ):
        score = min(
            score,
            20
        )

    # If the answer contains very little useful content,
    # cap the score.

    if count_words(answer) < 8:
        score = min(
            score,
            20
        )

    # =====================================================
    # DIFFICULTY
    # =====================================================

    difficulty = get_difficulty(
        score
    )

    # =====================================================
    # FEEDBACK
    # =====================================================

    if score >= 85:

        feedback = (
            "Excellent interview answer. "
            "Your response was relevant, detailed and "
            "supported by useful explanation."
        )

    elif score >= 70:

        feedback = (
            "Good interview answer. "
            "You addressed the question, but adding "
            "more technical depth or a practical example "
            "could make it stronger."
        )

    elif score >= 55:

        feedback = (
            "Your answer shows some understanding, "
            "but it needs more detail and a clearer "
            "connection to the question."
        )

    elif score >= 35:

        feedback = (
            "Your answer needs improvement. "
            "Try answering the question more directly "
            "and explain your reasoning."
        )

    else:

        feedback = (
            "Your answer does not sufficiently address "
            "the interview question. Try again with a "
            "clear explanation and relevant example."
        )

    # =====================================================
    # FEEDBACK DETAILS
    # =====================================================

    strengths, improvements = (
        build_feedback(
            relevance_score,
            concept_score,
            technical_score,
            depth_score,
            practical_score,
            structure_score,
            clarity_score
        )
    )

    # =====================================================
    # WEAKNESSES
    # =====================================================

    weaknesses = []

    if relevance_score < 70:
        weaknesses.append(
            "The answer was not sufficiently focused on the question."
        )

    if concept_score < 70:
        weaknesses.append(
            "Important concepts related to the question were missing."
        )

    if technical_score < 70:
        weaknesses.append(
            "Technical explanation could be stronger."
        )

    if depth_score < 70:
        weaknesses.append(
            "The explanation could contain more detail."
        )

    if practical_score < 70:
        weaknesses.append(
            "A practical example or project experience was missing."
        )

    if structure_score < 70:
        weaknesses.append(
            "The answer could be organized more clearly."
        )

    if clarity_score < 70:
        weaknesses.append(
            "The explanation could be clearer."
        )

    if not weaknesses:
        weaknesses.append(
            "No major weakness was detected."
        )

    # =====================================================
    # IMPROVEMENT GUIDANCE
    # =====================================================

    better_answer_guidance = (
        build_better_answer_guidance(
            relevance_score,
            concept_score,
            technical_score,
            depth_score,
            practical_score,
            structure_score
        )
    )

    # =====================================================
    # RESULT
    # =====================================================

    return {

        "score":
            score,

        "difficulty":
            difficulty,

        "feedback":
            feedback,

        "strengths":
            strengths,

        "weaknesses":
            weaknesses,

        "improvements":
            improvements,

        "better_answer_guidance":
            better_answer_guidance,

        "analysis": {

            "relevance_score":
                relevance_score,

            "concept_score":
                concept_score,

            "technical_score":
                technical_score,

            "depth_score":
                depth_score,

            "practical_score":
                practical_score,

            "structure_score":
                structure_score,

            "clarity_score":
                clarity_score
        },

        "follow_up_question":
            None
    }