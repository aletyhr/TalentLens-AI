from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from config.database import resume_history, interview_history
from config.extensions import limiter


career_readiness = Blueprint(
    "career_readiness",
    __name__
)


def clamp_score(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        value = 0

    return round(
        max(0, min(100, value)),
        2
    )


def get_readiness_level(score):
    if score >= 85:
        return "Highly Ready"

    if score >= 70:
        return "Ready"

    if score >= 55:
        return "Developing"

    return "Needs Preparation"


def calculate_profile_completeness(resume):
    """
    Measures whether important resume information
    has been detected.

    This is NOT a measure of candidate ability.
    It only measures profile completeness.
    """

    if not resume:
        return 0

    checks = [
        bool(resume.get("skills")),
        bool(resume.get("education")),
        bool(resume.get("experience")),
        bool(resume.get("predicted_role")),
        bool(resume.get("resume_insights")),
    ]

    completed = sum(
        1 for item in checks
        if item
    )

    return round(
        (completed / len(checks)) * 100,
        2
    )


def calculate_resume_readiness(resume):
    """
    Resume readiness uses the existing TalentLens
    resume analysis.

    ATS compatibility is the main resume signal.
    Resume completeness is a supporting signal.
    """

    if not resume:
        return 0

    ats_score = clamp_score(
        resume.get("ats_score", 0)
    )

    completeness = calculate_profile_completeness(
        resume
    )

    # ATS is the primary resume signal.
    resume_score = (
        ats_score * 0.75
        +
        completeness * 0.25
    )

    return clamp_score(
        resume_score
    )


def calculate_interview_readiness(history):
    """
    Uses completed interview performance.

    Latest performance receives more importance than
    the historical average so that recent improvement
    is reflected.
    """

    if not history:
        return None

    scores = []

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
            continue

        scores.append(
            clamp_score(score)
        )

    if not scores:
        return None

    latest_score = scores[0]

    average_score = (
        sum(scores) / len(scores)
    )

    if len(scores) >= 2:

        interview_score = (
            latest_score * 0.60
            +
            average_score * 0.40
        )

    else:

        interview_score = latest_score

    return clamp_score(
        interview_score
    )


def build_strengths(
    resume_readiness,
    interview_readiness,
    profile_completeness
):

    strengths = []

    if resume_readiness >= 80:
        strengths.append(
            "Your resume is well prepared for ATS-based screening."
        )

    elif resume_readiness >= 65:
        strengths.append(
            "Your resume has a reasonable level of ATS compatibility."
        )

    if interview_readiness is not None:

        if interview_readiness >= 80:
            strengths.append(
                "Your recent interview performance is strong."
            )

        elif interview_readiness >= 65:
            strengths.append(
                "Your interview performance shows a good foundation."
            )

    if profile_completeness >= 80:
        strengths.append(
            "Your resume contains most of the important profile sections."
        )

    if not strengths:
        strengths.append(
            "You have started building your career profile."
        )

    return strengths[:3]


def build_improvements(
    resume_readiness,
    interview_readiness,
    profile_completeness
):

    improvements = []

    if resume_readiness < 70:
        improvements.append(
            "Improve resume alignment and ATS compatibility."
        )

    elif resume_readiness < 85:
        improvements.append(
            "Further improve your resume before applying."
        )

    if interview_readiness is None:

        improvements.append(
            "Complete an AI mock interview to measure interview readiness."
        )

    elif interview_readiness < 70:

        improvements.append(
            "Practice more interview questions to improve interview readiness."
        )

    elif interview_readiness < 85:

        improvements.append(
            "Continue practicing interviews to strengthen your performance."
        )

    if profile_completeness < 80:

        improvements.append(
            "Complete the missing sections of your professional profile."
        )

    return improvements[:3]


def build_next_action(
    resume_readiness,
    interview_readiness,
    profile_completeness
):

    if interview_readiness is None:

        if resume_readiness < 70:

            return (
                "Improve your resume first, then complete an AI mock interview."
            )

        return (
            "Your resume is in a reasonable state. "
            "Complete an AI mock interview next."
        )

    if interview_readiness < 70:

        return (
            "Practice technical and resume-based interview questions "
            "and retake the mock interview."
        )

    if resume_readiness < 70:

        return (
            "Improve your resume's ATS compatibility before applying."
        )

    if profile_completeness < 80:

        return (
            "Complete the missing parts of your professional profile."
        )

    if interview_readiness < 85:

        return (
            "Continue interview practice to strengthen your readiness."
        )

    return (
        "Continue improving your resume and interview performance "
        "while applying to relevant opportunities."
    )


@career_readiness.route(
    "/career_readiness",
    methods=["GET"]
)
@jwt_required()
@limiter.limit("20 per minute")
def get_career_readiness():

    email = get_jwt_identity()

    try:

        # -------------------------------------------------
        # GET CURRENT USER'S LATEST RESUME
        # -------------------------------------------------

        resume = resume_history.find_one(
            {
                "email": email
            },
            {
                "_id": 0
            },
            sort=[
                (
                    "_id",
                    -1
                )
            ]
        )

        # -------------------------------------------------
        # GET CURRENT USER'S INTERVIEW HISTORY
        # -------------------------------------------------

        interview_history_data = list(
            interview_history.find(
                {
                    "email": email
                },
                {
                    "_id": 0
                }
            ).sort(
                "created_at",
                -1
            )
        )

    except Exception as error:

        print(
            "Career readiness database error:",
            error
        )

        return jsonify({
            "message":
                "Unable to calculate career readiness."
        }), 500

    # -----------------------------------------------------
    # NO RESUME
    # -----------------------------------------------------

    if not resume:

        return jsonify({

            "has_resume":
                False,

            "has_interview":
                bool(interview_history_data),

            "career_readiness":
                0,

            "readiness_level":
                "Not Started",

            "resume_readiness":
                0,

            "interview_readiness":
                0,

            "profile_completeness":
                0,

            "strengths": [],

            "improvements": [
                "Upload your resume to begin your TalentLens career readiness analysis."
            ],

            "next_action":
                "Upload your resume first."

        }), 200

    # -----------------------------------------------------
    # CALCULATE COMPONENTS
    # -----------------------------------------------------

    resume_readiness = calculate_resume_readiness(
        resume
    )

    profile_completeness = calculate_profile_completeness(
        resume
    )

    interview_readiness = calculate_interview_readiness(
        interview_history_data
    )

    # -----------------------------------------------------
    # CAREER READINESS
    # -----------------------------------------------------

    if interview_readiness is None:

        # When there is no interview evidence,
        # do not pretend that we know interview readiness.

        career_readiness = (
            resume_readiness * 0.70
            +
            profile_completeness * 0.30
        )

    else:

        career_readiness = (
            resume_readiness * 0.50
            +
            interview_readiness * 0.35
            +
            profile_completeness * 0.15
        )

    career_readiness = clamp_score(
        career_readiness
    )

    # -----------------------------------------------------
    # LEVEL
    # -----------------------------------------------------

    readiness_level = get_readiness_level(
        career_readiness
    )

    # -----------------------------------------------------
    # STRENGTHS
    # -----------------------------------------------------

    strengths = build_strengths(
        resume_readiness,
        interview_readiness,
        profile_completeness
    )

    # -----------------------------------------------------
    # IMPROVEMENTS
    # -----------------------------------------------------

    improvements = build_improvements(
        resume_readiness,
        interview_readiness,
        profile_completeness
    )

    # -----------------------------------------------------
    # NEXT ACTION
    # -----------------------------------------------------

    next_action = build_next_action(
        resume_readiness,
        interview_readiness,
        profile_completeness
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return jsonify({

        "has_resume":
            True,

        "has_interview":
            interview_readiness is not None,

        "career_readiness":
            career_readiness,

        "readiness_level":
            readiness_level,

        "resume_readiness":
            resume_readiness,

        "interview_readiness":
            (
                interview_readiness
                if interview_readiness is not None
                else 0
            ),

        "profile_completeness":
            profile_completeness,

        "predicted_role":
            resume.get(
                "predicted_role",
                ""
            ),

        "ats_score":
            clamp_score(
                resume.get(
                    "ats_score",
                    0
                )
            ),

        "resume_grade":
            resume.get(
                "resume_grade",
                ""
            ),

        "strengths":
            strengths,

        "improvements":
            improvements,

        "next_action":
            next_action,

        "interview_count":
            len(
                interview_history_data
            )

    }), 200