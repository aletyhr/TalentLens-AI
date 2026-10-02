from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from config.database import resume_history
from config.extensions import limiter


resume = Blueprint(
    "resume",
    __name__
)


# =========================================================
# SAVE RESUME ANALYSIS
# =========================================================

@resume.route(
    "/save_resume",
    methods=["POST"]
)
@jwt_required()
@limiter.limit("10 per minute")
def save_resume():

    email = get_jwt_identity()

    data = request.get_json() or {}


    # -----------------------------------------------------
    # Validate request
    # -----------------------------------------------------

    if not data:

        return jsonify({
            "message":
                "No resume data received"
        }), 400


    # -----------------------------------------------------
    # Validate filename
    # -----------------------------------------------------

    filename = data.get(
        "filename",
        ""
    )

    if not isinstance(
        filename,
        str
    ):

        return jsonify({
            "message":
                "Invalid filename"
        }), 400


    if len(filename) > 255:

        return jsonify({
            "message":
                "Filename is too long"
        }), 400


    # -----------------------------------------------------
    # Validate list fields
    # -----------------------------------------------------

    list_fields = [
        "skills",
        "education",
        "experience",
        "matched_skills",
        "missing_skills",
        "suggestions",
        "interview_questions",
        "role_evidence"
    ]


    for field in list_fields:

        value = data.get(
            field,
            []
        )

        if not isinstance(
            value,
            list
        ):

            return jsonify({
                "message":
                    f"Invalid {field} format"
            }), 400


        # Prevent abnormally large arrays
        if len(value) > 100:

            return jsonify({
                "message":
                    f"Too many items in {field}"
            }), 400


    # -----------------------------------------------------
    # Validate resume insights
    # -----------------------------------------------------

    resume_insights = data.get(
        "resume_insights",
        {}
    )

    if not isinstance(
        resume_insights,
        dict
    ):

        return jsonify({
            "message":
                "Invalid resume insights format"
        }), 400


    # -----------------------------------------------------
    # Build document
    # -----------------------------------------------------

    document = {

        "email":
            email,

        "filename":
            filename,

        # Scores
        "ats_score":
            data.get("ats_score"),

        "semantic_score":
            data.get("semantic_score"),

        "resume_grade":
            data.get("resume_grade"),

        "overall_score":
            data.get("overall_score"),

        # AI Prediction
        "predicted_role":
            data.get("predicted_role"),

        # Role Prediction Evidence
        "role_evidence":
            data.get(
                "role_evidence",
                []
            ),

        # Resume Information
        "skills":
            data.get("skills", []),

        "education":
            data.get("education", []),

        "experience":
            data.get("experience", []),

        # ATS Analysis
        "matched_skills":
            data.get("matched_skills", []),

        "missing_skills":
            data.get("missing_skills", []),

        # AI Suggestions
        "suggestions":
            data.get("suggestions", []),

        # Resume Insights
        "resume_insights":
            resume_insights,

        # Interview Questions
        "interview_questions":
            data.get(
                "interview_questions",
                []
            )
    }


    # -----------------------------------------------------
    # Save to MongoDB
    # -----------------------------------------------------

    try:

        resume_history.insert_one(
            document
        )

    except Exception as e:

        print(
            "Resume save error:",
            e
        )

        return jsonify({
            "message":
                "Unable to save resume analysis"
        }), 500


    return jsonify({
        "message":
            "Resume saved successfully."
    }), 201


# =========================================================
# RESUME HISTORY
# =========================================================

@resume.route(
    "/history",
    methods=["GET"]
)
@jwt_required()
@limiter.limit("30 per minute")
def history():

    email = get_jwt_identity()


    try:

        # Only return records belonging
        # to the authenticated user
        history_data = list(

            resume_history.find(

                {
                    "email":
                        email
                },

                {
                    "_id":
                        0
                }

            ).sort(
                "_id",
                -1
            )
        )

    except Exception as e:

        print(
            "Resume history error:",
            e
        )

        return jsonify({
            "message":
                "Unable to retrieve resume history"
        }), 500


    return jsonify(
        history_data
    ), 200


# =========================================================
# BULK RESUME UPLOAD
# =========================================================

@resume.route(
    "/bulk_upload",
    methods=["POST"]
)
@jwt_required()
@limiter.limit("5 per minute")
def bulk_upload():

    files = request.files.getlist(
        "resumes"
    )


    # -----------------------------------------------------
    # Check files
    # -----------------------------------------------------

    if not files:

        return jsonify({
            "message":
                "No resumes uploaded"
        }), 400


    # -----------------------------------------------------
    # Limit number of files
    # -----------------------------------------------------

    MAX_FILES = 10


    if len(files) > MAX_FILES:

        return jsonify({
            "message":
                f"Maximum {MAX_FILES} resumes can be uploaded at once."
        }), 400


    results = []


    # -----------------------------------------------------
    # Validate each file
    # -----------------------------------------------------

    for file in files:

        if not file.filename:

            continue


        filename = file.filename


        # Only PDF extension
        if not filename.lower().endswith(
            ".pdf"
        ):

            results.append({

                "filename":
                    filename,

                "status":
                    "rejected",

                "reason":
                    "Only PDF files are allowed."

            })

            continue


        # -------------------------------------------------
        # Verify actual PDF signature
        # -------------------------------------------------

        file_header = file.read(5)

        file.seek(0)


        if file_header != b"%PDF-":

            results.append({

                "filename":
                    filename,

                "status":
                    "rejected",

                "reason":
                    "Invalid PDF file."

            })

            continue


        # -------------------------------------------------
        # Accepted
        # -------------------------------------------------

        results.append({

            "filename":
                filename,

            "status":
                "received"

        })


    # =====================================================
    # RESPONSE
    # =====================================================

    return jsonify({

        "message":
            "Bulk resumes received successfully",

        "total_files":
            len(
                [
                    item
                    for item in results
                    if item["status"] == "received"
                ]
            ),

        "files":
            results

    }), 200