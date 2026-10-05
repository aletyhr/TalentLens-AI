from datetime import datetime, timezone

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from config.database import resume_history, interview_history
from config.extensions import limiter


analytics = Blueprint(
    "analytics",
    __name__
)


# =========================================================
# HELPERS
# =========================================================

def safe_score(value):
    """Convert a score to a safe 0-100 numeric value."""

    if isinstance(value, datetime):
        return 0

    try:
        value = float(value)
    except (TypeError, ValueError):
        value = 0

    return round(
        max(0, min(100, value)),
        2
    )


def calculate_average(scores):

    if not scores:
        return 0

    return round(
        sum(scores) / len(scores),
        2
    )


def calculate_improvement(scores):

    if len(scores) < 2:
        return 0

    first_score = safe_score(
        scores[0]
    )

    latest_score = safe_score(
        scores[-1]
    )

    return round(
        latest_score - first_score,
        2
    )


def get_profile_completeness(resume):

    if not resume:
        return 0

    checks = [
        bool(
            resume.get(
                "skills"
            )
        ),

        bool(
            resume.get(
                "education"
            )
        ),

        bool(
            resume.get(
                "experience"
            )
        ),

        bool(
            resume.get(
                "predicted_role"
            )
        ),

        bool(
            resume.get(
                "resume_insights"
            )
        ),
    ]

    completed = sum(
        1
        for item in checks
        if item
    )

    return round(
        (
            completed /
            len(checks)
        ) * 100,
        2
    )


def calculate_career_readiness(
    resume_score,
    interview_score,
    profile_completeness,
    has_interview
):

    resume_score = safe_score(
        resume_score
    )

    profile_completeness = safe_score(
        profile_completeness
    )

    if has_interview:

        interview_score = safe_score(
            interview_score
        )

        score = (
            resume_score * 0.50
            +
            interview_score * 0.35
            +
            profile_completeness * 0.15
        )

    else:

        score = (
            resume_score * 0.70
            +
            profile_completeness * 0.30
        )

    return safe_score(
        score
    )


def normalize_event_date(value):
    """
    Convert history dates into comparable
    naive UTC datetime objects.

    This prevents errors when MongoDB contains:
    - datetime values
    - timezone-aware datetime values
    - ISO date strings
    - missing dates
    """

    if isinstance(
        value,
        datetime
    ):

        if value.tzinfo is not None:

            return (
                value
                .astimezone(
                    timezone.utc
                )
                .replace(
                    tzinfo=None
                )
            )

        return value

    if isinstance(
        value,
        str
    ):

        try:

            parsed = datetime.fromisoformat(
                value.replace(
                    "Z",
                    "+00:00"
                )
            )

            if parsed.tzinfo is not None:

                parsed = (
                    parsed
                    .astimezone(
                        timezone.utc
                    )
                    .replace(
                        tzinfo=None
                    )
                )

            return parsed

        except (
            TypeError,
            ValueError
        ):

            return datetime.min

    return datetime.min


def serialize_date(value):

    if not value:
        return None

    normalized = normalize_event_date(
        value
    )

    if normalized == datetime.min:
        return None

    return normalized.isoformat()


# =========================================================
# ANALYTICS
# =========================================================

@analytics.route(
    "/analytics",
    methods=["GET"]
)
@jwt_required()
@limiter.limit(
    "20 per minute"
)
def get_analytics():

    email = get_jwt_identity()

    try:

        # =================================================
        # RESUME HISTORY
        # =================================================

        resumes = list(
            resume_history.find(
                {
                    "email": email
                },
                {
                    "_id": 0
                }
            ).sort(
                "uploaded_at",
                1
            )
        )

        # =================================================
        # INTERVIEW HISTORY
        # =================================================

        interviews = list(
            interview_history.find(
                {
                    "email": email
                },
                {
                    "_id": 0
                }
            ).sort(
                "created_at",
                1
            )
        )

        # =================================================
        # RESUME ANALYTICS
        # =================================================

        resume_history_data = []

        resume_scores = []

        ats_scores = []

        semantic_scores = []

        for index, resume in enumerate(
            resumes,
            start=1
        ):

            overall_score = safe_score(
                resume.get(
                    "overall_score",
                    0
                )
            )

            ats_score = safe_score(
                resume.get(
                    "ats_score",
                    0
                )
            )

            semantic_score = safe_score(
                resume.get(
                    "semantic_score",
                    0
                )
            )

            resume_scores.append(
                overall_score
            )

            ats_scores.append(
                ats_score
            )

            semantic_scores.append(
                semantic_score
            )

            uploaded_at = resume.get(
                "uploaded_at"
            )

            resume_history_data.append(
                {
                    "attempt":
                        index,

                    "date":
                        serialize_date(
                            uploaded_at
                        ),

                    "overall_score":
                        overall_score,

                    "ats_score":
                        ats_score,

                    "semantic_score":
                        semantic_score,

                    "resume_grade":
                        resume.get(
                            "resume_grade",
                            "N/A"
                        ),

                    "predicted_role":
                        resume.get(
                            "predicted_role",
                            ""
                        ),

                    "skills_count":
                        len(
                            resume.get(
                                "skills",
                                []
                            )
                        )
                        if isinstance(
                            resume.get(
                                "skills",
                                []
                            ),
                            list
                        )
                        else 0,

                    "matched_skills_count":
                        len(
                            resume.get(
                                "matched_skills",
                                []
                            )
                        )
                        if isinstance(
                            resume.get(
                                "matched_skills",
                                []
                            ),
                            list
                        )
                        else 0,

                    "missing_skills_count":
                        len(
                            resume.get(
                                "missing_skills",
                                []
                            )
                        )
                        if isinstance(
                            resume.get(
                                "missing_skills",
                                []
                            ),
                            list
                        )
                        else 0,
                }
            )

        # =================================================
        # INTERVIEW ANALYTICS
        # =================================================

        interview_history_data = []

        interview_scores = []

        for index, interview in enumerate(
            interviews,
            start=1
        ):

            overall_score = safe_score(
                interview.get(
                    "overall_score",
                    0
                )
            )

            interview_scores.append(
                overall_score
            )

            created_at = interview.get(
                "created_at"
            )

            interview_history_data.append(
                {
                    "attempt":
                        index,

                    "date":
                        serialize_date(
                            created_at
                        ),

                    "overall_score":
                        overall_score,

                    "role":
                        interview.get(
                            "role",
                            ""
                        ),

                    "interview_type":
                        interview.get(
                            "interview_type",
                            ""
                        ),

                    "total_questions":
                        interview.get(
                            "total_questions",
                            0
                        ),
                }
            )

        # =================================================
        # CURRENT VALUES
        # =================================================

        latest_resume = (
            resumes[-1]
            if resumes
            else None
        )

        latest_interview = (
            interviews[-1]
            if interviews
            else None
        )

        current_resume_score = (

            safe_score(
                latest_resume.get(
                    "overall_score",
                    0
                )
            )

            if latest_resume

            else 0

        )

        current_ats_score = (

            safe_score(
                latest_resume.get(
                    "ats_score",
                    0
                )
            )

            if latest_resume

            else 0

        )

        current_semantic_score = (

            safe_score(
                latest_resume.get(
                    "semantic_score",
                    0
                )
            )

            if latest_resume

            else 0

        )

        current_interview_score = (

            safe_score(
                latest_interview.get(
                    "overall_score",
                    0
                )
            )

            if latest_interview

            else 0

        )

        # =================================================
        # BEST SCORES
        # =================================================

        best_resume_score = (

            max(
                resume_scores
            )

            if resume_scores

            else 0

        )

        best_interview_score = (

            max(
                interview_scores
            )

            if interview_scores

            else 0

        )

        # =================================================
        # AVERAGES
        # =================================================

        average_resume_score = (
            calculate_average(
                resume_scores
            )
        )

        average_interview_score = (
            calculate_average(
                interview_scores
            )
        )

        average_ats_score = (
            calculate_average(
                ats_scores
            )
        )

        average_semantic_score = (
            calculate_average(
                semantic_scores
            )
        )

        # =================================================
        # IMPROVEMENT
        # =================================================

        resume_improvement = (
            calculate_improvement(
                resume_scores
            )
        )

        interview_improvement = (
            calculate_improvement(
                interview_scores
            )
        )

        # =================================================
        # SKILLS
        # =================================================

        current_skills = []

        current_missing_skills = []

        if latest_resume:

            skills = latest_resume.get(
                "skills",
                []
            )

            missing_skills = latest_resume.get(
                "missing_skills",
                []
            )

            if isinstance(
                skills,
                list
            ):

                current_skills = skills

            if isinstance(
                missing_skills,
                list
            ):

                current_missing_skills = (
                    missing_skills
                )

        # =================================================
        # CURRENT PROFILE COMPLETENESS
        # =================================================

        profile_completeness = (
            get_profile_completeness(
                latest_resume
            )
        )

        # =================================================
        # CURRENT CAREER READINESS
        # =================================================

        if latest_interview:

            interview_readiness = (
                current_interview_score
            )

            career_readiness = (
                calculate_career_readiness(

                    current_resume_score,

                    interview_readiness,

                    profile_completeness,

                    True

                )
            )

        else:

            interview_readiness = None

            career_readiness = (
                calculate_career_readiness(

                    current_resume_score,

                    0,

                    profile_completeness,

                    False

                )
            )

        # =================================================
        # CAREER READINESS HISTORY
        # =================================================

        career_events = []

        # -------------------------------------------------
        # RESUME EVENTS
        # -------------------------------------------------

        for resume in resumes:

            career_events.append(
                {
                    "type":
                        "resume",

                    "date":
                        resume.get(
                            "uploaded_at"
                        ),

                    "resume_score":
                        safe_score(
                            resume.get(
                                "overall_score",
                                0
                            )
                        ),

                    "interview_score":
                        None,

                    "resume":
                        resume,
                }
            )

        # -------------------------------------------------
        # INTERVIEW EVENTS
        # -------------------------------------------------

        for interview in interviews:

            career_events.append(
                {
                    "type":
                        "interview",

                    "date":
                        interview.get(
                            "created_at"
                        ),

                    "resume_score":
                        None,

                    "interview_score":
                        safe_score(
                            interview.get(
                                "overall_score",
                                0
                            )
                        ),

                    "interview":
                        interview,
                }
            )

        # -------------------------------------------------
        # SORT EVENTS
        # -------------------------------------------------
        #
        # IMPORTANT:
        # The previous code used:
        #
        #     item.get("date") or 0
        #
        # MongoDB dates are datetime objects.
        # Python cannot compare datetime with int.
        #
        # We therefore normalize every date before
        # sorting.
        # -------------------------------------------------

        career_events.sort(
            key=lambda item:
                normalize_event_date(
                    item.get(
                        "date"
                    )
                )
        )

        career_readiness_history = []

        history_resume_score = 0

        history_interview_score = 0

        history_has_interview = False

        history_profile_completeness = 0

        for index, event in enumerate(
            career_events,
            start=1
        ):

            # ---------------------------------------------
            # UPDATE RESUME INFORMATION
            # ---------------------------------------------

            if event["type"] == "resume":

                history_resume_score = (
                    safe_score(
                        event[
                            "resume_score"
                        ]
                    )
                )

                history_profile_completeness = (
                    get_profile_completeness(
                        event.get(
                            "resume"
                        )
                    )
                )

            # ---------------------------------------------
            # UPDATE INTERVIEW INFORMATION
            # ---------------------------------------------

            if event["type"] == "interview":

                history_interview_score = (
                    safe_score(
                        event[
                            "interview_score"
                        ]
                    )
                )

                history_has_interview = True

            # ---------------------------------------------
            # CALCULATE READINESS
            # ---------------------------------------------

            history_readiness = (
                calculate_career_readiness(

                    history_resume_score,

                    history_interview_score,

                    history_profile_completeness,

                    history_has_interview

                )
            )

            event_date = event.get(
                "date"
            )

            career_readiness_history.append(
                {
                    "attempt":
                        index,

                    "date":
                        serialize_date(
                            event_date
                        ),

                    "type":
                        event[
                            "type"
                        ],

                    "label":
                        (
                            "Resume Analysis"

                            if event[
                                "type"
                            ] == "resume"

                            else

                            "AI Interview"
                        ),

                    "career_readiness":
                        history_readiness,

                    "resume_score":
                        history_resume_score,

                    "interview_score":
                        (
                            history_interview_score

                            if history_has_interview

                            else None
                        ),

                    "profile_completeness":
                        history_profile_completeness,
                }
            )

        # =================================================
        # PERFORMANCE STATUS
        # =================================================

        if resume_improvement > 0:

            resume_status = "Improving"

        elif resume_improvement < 0:

            resume_status = "Declining"

        else:

            resume_status = "Stable"

        if interview_improvement > 0:

            interview_status = "Improving"

        elif interview_improvement < 0:

            interview_status = "Declining"

        else:

            interview_status = "Stable"

        # =================================================
        # RESPONSE
        # =================================================

        return jsonify(

            {

                "success": True,

                # -----------------------------------------
                # OVERVIEW
                # -----------------------------------------

                "overview": {

                    "career_readiness":
                        career_readiness,

                    "resume_score":
                        current_resume_score,

                    "interview_score":
                        (
                            current_interview_score

                            if latest_interview

                            else None
                        ),

                    "profile_completeness":
                        profile_completeness,

                    "resume_analyses":
                        len(
                            resumes
                        ),

                    "interviews_completed":
                        len(
                            interviews
                        ),

                    "best_resume_score":
                        safe_score(
                            best_resume_score
                        ),

                    "best_interview_score":
                        safe_score(
                            best_interview_score
                        ),

                    "average_resume_score":
                        average_resume_score,

                    "average_interview_score":
                        average_interview_score,

                    "resume_improvement":
                        resume_improvement,

                    "interview_improvement":
                        interview_improvement,

                },

                # -----------------------------------------
                # RESUME
                # -----------------------------------------

                "resume": {

                    "current_score":
                        current_resume_score,

                    "best_score":
                        safe_score(
                            best_resume_score
                        ),

                    "average_score":
                        average_resume_score,

                    "average_ats_score":
                        average_ats_score,

                    "average_semantic_score":
                        average_semantic_score,

                    "current_ats_score":
                        current_ats_score,

                    "current_semantic_score":
                        current_semantic_score,

                    "status":
                        resume_status,

                    "history":
                        resume_history_data,

                },

                # -----------------------------------------
                # INTERVIEW
                # -----------------------------------------

                "interview": {

                    "has_history":
                        bool(
                            interviews
                        ),

                    "latest_score":
                        (
                            current_interview_score

                            if latest_interview

                            else None
                        ),

                    "best_score":
                        safe_score(
                            best_interview_score
                        ),

                    "average_score":
                        average_interview_score,

                    "status":
                        (
                            interview_status

                            if interviews

                            else "Not Started"
                        ),

                    "history":
                        interview_history_data,

                },

                # -----------------------------------------
                # SKILLS
                # -----------------------------------------

                "skills": {

                    "current":
                        current_skills,

                    "missing":
                        current_missing_skills,

                    "total":
                        len(
                            current_skills
                        ),

                    "missing_count":
                        len(
                            current_missing_skills
                        ),

                },

                # -----------------------------------------
                # CAREER READINESS
                # -----------------------------------------

                "career_readiness": {

                    "score":
                        career_readiness,

                    "resume":
                        current_resume_score,

                    "interview":
                        interview_readiness,

                    "profile":
                        profile_completeness,

                    "history":
                        career_readiness_history,

                },

                # -----------------------------------------
                # DIRECT HISTORY
                # -----------------------------------------

                "career_readiness_history":
                    career_readiness_history,

            }

        ), 200

    except Exception as error:

        print(
            "Analytics error:",
            error
        )

        return jsonify(

            {

                "success": False,

                "message":
                    "Unable to load analytics."

            }

        ), 500