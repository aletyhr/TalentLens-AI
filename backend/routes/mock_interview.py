from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from config.extensions import limiter
from ai.mock_interview import evaluate_answer
from config.database import interview_history


mock_interview = Blueprint(
    "mock_interview",
    __name__
)


# =========================================================
# TEXT CLEANING
# =========================================================

def clean_text(value):
    if not isinstance(value, str):
        return ""

    return value.strip()


# =========================================================
# NORMALIZE INTERVIEW TYPE
# =========================================================

def normalize_interview_type(value):

    allowed_types = {
        "resume",
        "technical",
        "hr",
        "behavioral",
        "resume_questions"
    }

    value = clean_text(value).lower()

    if value not in allowed_types:
        return "resume"

    return value


# =========================================================
# RESUME MOCK INTERVIEW QUESTIONS
# =========================================================

def build_resume_questions(
    role,
    skills,
    education,
    experience,
    resume_text
):

    questions = []

    role = clean_text(role)
    resume_text = clean_text(resume_text)

    skill_list = [
        clean_text(skill)
        for skill in skills
        if clean_text(skill)
    ]

    education_list = [
        clean_text(item)
        for item in education
        if clean_text(item)
    ]

    experience_list = [
        clean_text(item)
        for item in experience
        if clean_text(item)
    ]

    questions.append(
        "Tell me about yourself and your background."
    )

    if role:

        questions.append(
            f"Your resume appears to be focused on {role}. "
            f"Can you explain your interest and experience "
            f"in this area?"
        )

    for skill in skill_list[:7]:

        questions.append(
            f"You mentioned {skill} in your resume. "
            f"Can you explain your practical experience "
            f"using {skill}?"
        )

    if skill_list:

        skills_text = ", ".join(
            skill_list[:5]
        )

        questions.append(
            f"Your resume lists skills such as {skills_text}. "
            f"Which of these skills are you most confident "
            f"in and why?"
        )

    if resume_text:

        questions.append(
            "Describe one important project from your resume. "
            "What problem did you solve, what technology did "
            "you use, and what was the result?"
        )

        questions.append(
            "Choose one project from your resume and explain "
            "the most difficult technical challenge you faced "
            "while building it."
        )

    if experience_list:

        questions.append(
            "Tell me about your most important experience "
            "mentioned in your resume and what you learned "
            "from it."
        )

        questions.append(
            "Describe a real problem you faced during your "
            "academic or professional experience and explain "
            "how you solved it."
        )

    if education_list:

        questions.append(
            "Which part of your academic background has "
            "prepared you the most for your career direction?"
        )

        questions.append(
            "Tell me about a technical subject you studied "
            "that you have also applied in a project."
        )

    if role:

        questions.append(
            f"Imagine you are working as a {role} and "
            "encounter a difficult technical problem. "
            "How would you approach solving it?"
        )

    else:

        questions.append(
            "Imagine you encounter a difficult technical "
            "problem in your area of expertise. How would "
            "you approach solving it?"
        )

    questions.append(
        "Tell me about a time when you had to learn "
        "something quickly to complete a project."
    )

    questions.append(
        "Tell me about a challenge you faced in a "
        "project and how you handled it."
    )

    questions.append(
        "Which technical skill from your resume do "
        "you want to improve further, and why?"
    )

    if role:

        questions.append(
            f"Where do you see yourself developing further "
            f"in the {role} area?"
        )

    else:

        questions.append(
            "What technical area would you like to develop "
            "further in your career?"
        )

    return questions[:15]


# =========================================================
# TECHNICAL QUESTIONS
# =========================================================

def build_technical_questions(
    role,
    skills,
    resume_text
):

    questions = []

    skill_list = [
        clean_text(skill)
        for skill in skills
        if clean_text(skill)
    ]

    role = clean_text(role)

    for skill in skill_list[:8]:

        questions.append(
            f"Explain {skill} and describe how you have "
            f"used it in your projects or practical work."
        )

    if skill_list:

        skills_text = ", ".join(
            skill_list[:5]
        )

        questions.append(
            f"Among {skills_text}, which technical skill "
            f"are you strongest in and why?"
        )

    questions.extend([
        "Describe a technical problem you solved. "
        "What was your approach?",

        "How do you debug a problem when your first "
        "solution does not work?",

        "How do you test your technical work before "
        "considering it complete?",

        "Describe a project where you had to make "
        "an important technical decision.",

        "How do you learn a new technical technology "
        "or framework?",

        "Explain a technical concept that you "
        "understand particularly well."
    ])

    if role:

        questions.append(
            f"What technical challenges do you expect "
            f"to face when working as a {role}?"
        )

    return questions[:15]


# =========================================================
# HR QUESTIONS
# =========================================================

def build_hr_questions(
    role,
    resume_text
):

    questions = [

        "Tell me about yourself.",

        "Why are you interested in this career?",

        "Why are you interested in this type of role?",

        "What are your greatest strengths?",

        "What is one area you are currently improving?",

        "Why should a company consider you for an "
        "entry-level position?",

        "What motivates you to perform well?",

        "How do you handle pressure or deadlines?",

        "How do you handle disagreement with a teammate?",

        "What type of work environment helps you "
        "perform at your best?",

        "Where do you see yourself developing over "
        "the next three years?",

        "What would you like your first job to teach you?"
    ]

    if role:

        questions.append(
            f"Why do you want to build your career "
            f"in the {role} area?"
        )

    return questions[:15]


# =========================================================
# BEHAVIORAL QUESTIONS
# =========================================================

def build_behavioral_questions():

    return [

        "Tell me about a difficult situation you faced.",

        "Describe a time when you worked as part of a team.",

        "Tell me about a mistake you made and what "
        "you learned from it.",

        "Describe a situation where you had to learn "
        "something quickly.",

        "Tell me about a time you solved a problem creatively.",

        "Describe a time when you received critical feedback.",

        "Tell me about a time when you had a disagreement "
        "with a teammate.",

        "Describe a situation where you had to meet "
        "a difficult deadline.",

        "Tell me about a time when your original plan "
        "did not work.",

        "Describe a situation where you took responsibility "
        "for a problem.",

        "Tell me about an achievement you are proud of.",

        "Describe a time when you helped someone else "
        "solve a problem."
    ]


# =========================================================
# RESUME-SPECIFIC QUESTIONS
# =========================================================

def build_resume_specific_questions(
    role,
    skills,
    education,
    experience,
    resume_text
):

    questions = [

        "Walk me through your resume.",

        "Which project on your resume are you "
        "most proud of?",

        "What was your exact contribution to "
        "your most important project?"
    ]

    skill_list = [
        clean_text(skill)
        for skill in skills
        if clean_text(skill)
    ]

    education_list = [
        clean_text(item)
        for item in education
        if clean_text(item)
    ]

    experience_list = [
        clean_text(item)
        for item in experience
        if clean_text(item)
    ]

    for skill in skill_list[:6]:

        questions.append(
            f"You listed {skill} on your resume. "
            f"How have you actually used it?"
        )

    if experience_list:

        questions.append(
            "Tell me about your most important "
            "experience mentioned on your resume."
        )

        questions.append(
            "What did you learn from your internship "
            "or professional experience?"
        )

    if education_list:

        questions.append(
            "How has your education prepared you "
            "for your career?"
        )

    questions.append(
        "Which achievement on your resume best "
        "represents your abilities?"
    )

    questions.append(
        "If you could improve one part of your "
        "resume, what would you change?"
    )

    questions.append(
        "Which statement on your resume would "
        "you be most prepared to explain in detail?"
    )

    questions.append(
        "Which skill on your resume are you "
        "currently strongest in?"
    )

    return questions[:15]


# =========================================================
# GENERATE QUESTIONS
# =========================================================

def build_interview_questions(
    interview_type,
    role,
    skills,
    education,
    experience,
    resume_text
):

    interview_type = normalize_interview_type(
        interview_type
    )

    if interview_type == "technical":

        questions = build_technical_questions(
            role,
            skills,
            resume_text
        )

    elif interview_type == "hr":

        questions = build_hr_questions(
            role,
            resume_text
        )

    elif interview_type == "behavioral":

        questions = build_behavioral_questions()

    elif interview_type == "resume_questions":

        questions = build_resume_specific_questions(
            role,
            skills,
            education,
            experience,
            resume_text
        )

    else:

        questions = build_resume_questions(
            role,
            skills,
            education,
            experience,
            resume_text
        )

    unique_questions = []

    seen = set()

    for question in questions:

        normalized = " ".join(
            question.lower().split()
        )

        if normalized in seen:
            continue

        seen.add(normalized)

        unique_questions.append(
            question
        )

    return unique_questions[:15]


# =========================================================
# EVALUATE ANSWER
# =========================================================

@mock_interview.route(
    "/evaluate_answer",
    methods=["POST"]
)
@jwt_required()
@limiter.limit("20 per minute")
def evaluate_interview_answer():

    data = request.get_json(
        silent=True
    ) or {}

    question = data.get(
        "question",
        ""
    )

    answer = data.get(
        "answer",
        ""
    )

    if not isinstance(question, str):

        return jsonify({
            "message": "Invalid question format"
        }), 400

    if not isinstance(answer, str):

        return jsonify({
            "message": "Invalid answer format"
        }), 400

    question = question.strip()
    answer = answer.strip()

    if not question:

        return jsonify({
            "message": "Question is required"
        }), 400

    if not answer:

        return jsonify({
            "message": "Answer is required"
        }), 400

    if len(question) > 2000:

        return jsonify({
            "message": "Question is too long"
        }), 400

    if len(answer) > 10000:

        return jsonify({
            "message": "Answer is too long"
        }), 400

    try:

        result = evaluate_answer(
            question,
            answer
        )

        return jsonify(
            result
        ), 200

    except Exception as error:

        print(
            "Interview evaluation error:",
            error
        )

        return jsonify({
            "message":
                "Unable to evaluate interview answer"
        }), 500


# =========================================================
# START INTERVIEW
# =========================================================

@mock_interview.route(
    "/start_interview",
    methods=["POST"]
)
@jwt_required()
@limiter.limit("10 per minute")
def start_interview():

    data = request.get_json(
        silent=True
    ) or {}

    interview_type = normalize_interview_type(
        data.get(
            "interview_type",
            "resume"
        )
    )

    role = data.get(
        "role",
        ""
    )

    skills = data.get(
        "skills",
        []
    )

    education = data.get(
        "education",
        []
    )

    experience = data.get(
        "experience",
        []
    )

    resume_text = data.get(
        "resume_text",
        ""
    )

    # -----------------------------------------------------
    # ROLE
    # -----------------------------------------------------

    if not isinstance(role, str):

        return jsonify({
            "message":
                "Invalid resume career direction"
        }), 400

    role = role.strip()

    if not role:

        return jsonify({
            "message":
                "Resume career direction is required"
        }), 400

    if len(role) > 200:

        return jsonify({
            "message":
                "Resume career direction is too long"
        }), 400

    # -----------------------------------------------------
    # SKILLS
    # -----------------------------------------------------

    if not isinstance(skills, list):

        return jsonify({
            "message":
                "Skills must be a list"
        }), 400

    if len(skills) > 50:

        return jsonify({
            "message":
                "Too many skills provided"
        }), 400

    # -----------------------------------------------------
    # EDUCATION
    # -----------------------------------------------------

    if not isinstance(education, list):

        return jsonify({
            "message":
                "Education must be a list"
        }), 400

    if len(education) > 50:

        return jsonify({
            "message":
                "Too many education entries"
        }), 400

    # -----------------------------------------------------
    # EXPERIENCE
    # -----------------------------------------------------

    if not isinstance(experience, list):

        return jsonify({
            "message":
                "Experience must be a list"
        }), 400

    if len(experience) > 50:

        return jsonify({
            "message":
                "Too many experience entries"
        }), 400

    # -----------------------------------------------------
    # RESUME TEXT
    # -----------------------------------------------------

    if not isinstance(resume_text, str):

        return jsonify({
            "message":
                "Invalid resume text"
        }), 400

    resume_text = resume_text.strip()

    if len(resume_text) > 100000:

        return jsonify({
            "message":
                "Resume text is too long"
        }), 400

    # -----------------------------------------------------
    # GENERATE QUESTIONS
    # -----------------------------------------------------

    try:

        questions = build_interview_questions(
            interview_type,
            role,
            skills,
            education,
            experience,
            resume_text
        )

        return jsonify({

            "role":
                role,

            "interview_type":
                interview_type,

            "resume_based":
                interview_type in {
                    "resume",
                    "technical",
                    "resume_questions"
                },

            "questions":
                questions

        }), 200

    except Exception as error:

        print(
            "Interview question generation error:",
            error
        )

        return jsonify({
            "message":
                "Unable to generate interview questions"
        }), 500


# =========================================================
# SAVE COMPLETED INTERVIEW
# =========================================================

@mock_interview.route(
    "/save_interview",
    methods=["POST"]
)
@jwt_required()
@limiter.limit("10 per minute")
def save_interview():

    email = get_jwt_identity()

    data = request.get_json(
        silent=True
    ) or {}

    interview_type = normalize_interview_type(
        data.get(
            "interview_type",
            "resume"
        )
    )

    role = data.get(
        "role",
        ""
    )

    skills = data.get(
        "skills",
        []
    )

    results = data.get(
        "results",
        []
    )

    overall_score = data.get(
        "overall_score",
        0
    )

    total_questions = data.get(
        "total_questions",
        0
    )

    # -----------------------------------------------------
    # ROLE
    # -----------------------------------------------------

    if not isinstance(role, str):

        return jsonify({
            "message":
                "Invalid resume career direction"
        }), 400

    role = role.strip()

    if not role:

        return jsonify({
            "message":
                "Resume career direction is required"
        }), 400

    if len(role) > 200:

        return jsonify({
            "message":
                "Resume career direction is too long"
        }), 400

    # -----------------------------------------------------
    # SKILLS
    # -----------------------------------------------------

    if not isinstance(skills, list):

        return jsonify({
            "message":
                "Skills must be a list"
        }), 400

    if len(skills) > 50:

        return jsonify({
            "message":
                "Too many skills provided"
        }), 400

    # -----------------------------------------------------
    # RESULTS
    # -----------------------------------------------------

    if not isinstance(results, list):

        return jsonify({
            "message":
                "Results must be a list"
        }), 400

    if len(results) == 0:

        return jsonify({
            "message":
                "Interview results are required"
        }), 400

    if len(results) > 50:

        return jsonify({
            "message":
                "Too many interview results"
        }), 400

    # -----------------------------------------------------
    # SCORE
    # -----------------------------------------------------

    try:

        overall_score = float(
            overall_score
        )

    except (
        TypeError,
        ValueError
    ):

        return jsonify({
            "message":
                "Invalid overall score"
        }), 400

    if (
        overall_score < 0
        or overall_score > 100
    ):

        return jsonify({
            "message":
                "Overall score must be between 0 and 100"
        }), 400

    # -----------------------------------------------------
    # QUESTION COUNT
    # -----------------------------------------------------

    try:

        total_questions = int(
            total_questions
        )

    except (
        TypeError,
        ValueError
    ):

        return jsonify({
            "message":
                "Invalid total question count"
        }), 400

    if (
        total_questions <= 0
        or total_questions > 50
    ):

        return jsonify({
            "message":
                "Invalid total question count"
        }), 400

    # -----------------------------------------------------
    # DATABASE DOCUMENT
    # -----------------------------------------------------

    document = {

        "email":
            email,

        "role":
            role,

        "interview_type":
            interview_type,

        "skills":
            skills,

        "overall_score":
            overall_score,

        "total_questions":
            total_questions,

        "results":
            results,

        "resume_based":
            interview_type in {
                "resume",
                "technical",
                "resume_questions"
            },

        "created_at":
            datetime.utcnow()

    }

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    try:

        interview_history.insert_one(
            document
        )

    except Exception as error:

        print(
            "Interview save error:",
            error
        )

        return jsonify({
            "message":
                "Unable to save interview"
        }), 500

    return jsonify({
        "message":
            "Interview saved successfully"
    }), 201


# =========================================================
# INTERVIEW HISTORY
# =========================================================

@mock_interview.route(
    "/interview_history",
    methods=["GET"]
)
@jwt_required()
@limiter.limit("30 per minute")
def interview_history_route():

    email = get_jwt_identity()

    try:

        history = list(
            interview_history
            .find(
                {
                    "email":
                        email
                },
                {
                    "_id":
                        0
                }
            )
            .sort(
                "created_at",
                -1
            )
        )

        return jsonify(
            history
        ), 200

    except Exception as error:

        print(
            "Interview history error:",
            error
        )

        return jsonify({
            "message":
                "Unable to retrieve interview history"
        }), 500


# =========================================================
# INTERVIEW STATISTICS
# =========================================================

@mock_interview.route(
    "/interview_stats",
    methods=["GET"]
)
@jwt_required()
@limiter.limit("30 per minute")
def interview_stats():

    email = get_jwt_identity()

    try:

        history = list(
            interview_history
            .find(
                {
                    "email":
                        email
                },
                {
                    "_id":
                        0
                }
            )
            .sort(
                "created_at",
                -1
            )
        )

        # -------------------------------------------------
        # NO HISTORY
        # -------------------------------------------------

        if not history:

            return jsonify({

                "has_history":
                    False,

                "total_interviews":
                    0,

                "total_questions":
                    0,

                "average_score":
                    0,

                "best_score":
                    0,

                "latest_score":
                    0,

                "improvement":
                    0,

                "readiness_level":
                    "Not Started",

                "recent_attempts":
                    []

            }), 200

        # -------------------------------------------------
        # SCORES
        # -------------------------------------------------

        scores = []

        total_questions = 0

        for item in history:

            try:

                score = float(
                    item.get(
                        "overall_score",
                        0
                    )
                )

            except (
                TypeError,
                ValueError
            ):

                score = 0

            score = max(
                0,
                min(
                    100,
                    score
                )
            )

            scores.append(
                score
            )

            try:

                total_questions += int(
                    item.get(
                        "total_questions",
                        0
                    )
                )

            except (
                TypeError,
                ValueError
            ):

                pass

        total_interviews = len(
            history
        )

        average_score = (
            sum(scores) / len(scores)
            if scores
            else 0
        )

        best_score = (
            max(scores)
            if scores
            else 0
        )

        latest_score = (
            scores[0]
            if scores
            else 0
        )

        # -------------------------------------------------
        # IMPROVEMENT
        # -------------------------------------------------

        if len(scores) >= 2:

            previous_score = scores[1]

            improvement = (
                latest_score -
                previous_score
            )

        else:

            improvement = 0

        # -------------------------------------------------
        # READINESS
        # -------------------------------------------------

        if latest_score >= 85:

            readiness_level = (
                "Interview Ready"
            )

        elif latest_score >= 70:

            readiness_level = (
                "Almost Ready"
            )

        elif latest_score >= 50:

            readiness_level = (
                "Needs More Practice"
            )

        else:

            readiness_level = (
                "Keep Practicing"
            )

        # -------------------------------------------------
        # RECENT ATTEMPTS
        # -------------------------------------------------

        recent_attempts = []

        for item in history[:5]:

            try:

                attempt_score = float(
                    item.get(
                        "overall_score",
                        0
                    )
                )

            except (
                TypeError,
                ValueError
            ):

                attempt_score = 0

            try:

                attempt_questions = int(
                    item.get(
                        "total_questions",
                        0
                    )
                )

            except (
                TypeError,
                ValueError
            ):

                attempt_questions = 0

            created_at = item.get(
                "created_at"
            )

            recent_attempts.append({

                "score":
                    attempt_score,

                "total_questions":
                    attempt_questions,

                "interview_type":
                    item.get(
                        "interview_type",
                        "resume"
                    ),

                "role":
                    item.get(
                        "role",
                        ""
                    ),

                "created_at":
                    (
                        created_at.isoformat()
                        if created_at
                        else None
                    )

            })

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({

            "has_history":
                True,

            "total_interviews":
                total_interviews,

            "total_questions":
                total_questions,

            "average_score":
                round(
                    average_score,
                    2
                ),

            "best_score":
                round(
                    best_score,
                    2
                ),

            "latest_score":
                round(
                    latest_score,
                    2
                ),

            "improvement":
                round(
                    improvement,
                    2
                ),

            "readiness_level":
                readiness_level,

            "recent_attempts":
                recent_attempts

        }), 200

    except Exception as error:

        print(
            "Interview statistics error:",
            error
        )

        return jsonify({
            "message":
                "Unable to retrieve interview statistics"
        }), 500