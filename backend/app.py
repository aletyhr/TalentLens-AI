from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

import os
import uuid
import re

load_dotenv()

from config.extensions import limiter
from models.user import bcrypt

from routes.auth import auth
from routes.resume import resume
from routes.mock_interview import mock_interview
from routes.job_match import job_match
from routes.career_readiness import career_readiness

from utils.pdf_reader import extract_text

from ai.skill_extractor import extract_skills
from ai.education_extractor import extract_education
from ai.experience_extractor import extract_experience
from ai.contact_extractor import extract_contact_info

from ai.ats_calculator import calculate_ats_score
from ai.semantic_matcher import calculate_semantic_score
from ai.resume_grader import calculate_resume_grade
from ai.job_role_predictor import predict_job_role
from ai.suggestion_engine import generate_suggestions
from ai.interview_questions import get_interview_questions
from ai.resume_insights import generate_resume_insights


# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)

limiter.init_app(app)


# =========================================================
# CORS
# =========================================================

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ]
        }
    }
)


# =========================================================
# JWT
# =========================================================

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)


@jwt.invalid_token_loader
def invalid_token_callback(error):

    return jsonify({
        "message": error
    }), 401


@jwt.unauthorized_loader
def unauthorized_callback(error):

    return jsonify({
        "message": error
    }), 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):

    return jsonify({
        "message": "Token has expired"
    }), 401


# =========================================================
# BCRYPT
# =========================================================

bcrypt.init_app(app)


# =========================================================
# BLUEPRINTS
# =========================================================

app.register_blueprint(auth)
app.register_blueprint(resume)
app.register_blueprint(mock_interview)
app.register_blueprint(job_match)
app.register_blueprint(career_readiness)


# =========================================================
# UPLOAD CONFIGURATION
# =========================================================

UPLOAD_FOLDER = "uploads"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


ALLOWED_EXTENSIONS = {
    "pdf"
}


# =========================================================
# FILE VALIDATION
# =========================================================

def allowed_file(filename):

    return (
        "." in filename
        and filename.rsplit(
            ".",
            1
        )[1].lower()
        in ALLOWED_EXTENSIONS
    )


# =========================================================
# RESUME VALIDATION
# =========================================================

def is_likely_resume(text):

    if not text:
        return False

    normalized_text = re.sub(
        r"\s+",
        " ",
        text.lower()
    ).strip()

    if len(normalized_text) < 100:
        return False

    resume_keywords = [
        "resume",
        "curriculum vitae",
        "cv",
        "education",
        "qualification",
        "academic",
        "experience",
        "work experience",
        "employment",
        "professional experience",
        "skills",
        "technical skills",
        "skill",
        "project",
        "projects",
        "internship",
        "internships",
        "certification",
        "certifications",
        "achievement",
        "achievements",
        "objective",
        "career objective",
        "profile",
        "summary",
        "linkedin",
        "github",
        "developer",
        "engineer",
        "student",
        "analyst",
        "analytics"
    ]

    matched_keywords = 0

    for keyword in resume_keywords:

        if keyword in normalized_text:
            matched_keywords += 1

    if matched_keywords < 3:
        return False

    section_keywords = [
        "education",
        "experience",
        "skills",
        "projects",
        "certifications",
        "objective",
        "summary",
        "internship"
    ]

    section_matches = 0

    for section in section_keywords:

        if section in normalized_text:
            section_matches += 1

    if section_matches < 2:
        return False

    return True


# =========================================================
# HOME ROUTE
# =========================================================

@app.route("/")
@limiter.limit("30 per minute")
def home():

    return jsonify({
        "message":
            "TalentLens AI Backend Running Successfully!"
    })


# =========================================================
# RESUME UPLOAD
# =========================================================

@app.route(
    "/upload",
    methods=["POST"]
)
@limiter.limit("10 per minute")
def upload_resume():

    # -----------------------------------------------------
    # CHECK FILE
    # -----------------------------------------------------

    if "resume" not in request.files:

        return jsonify({
            "message": "No file uploaded"
        }), 400

    file = request.files["resume"]

    if file.filename == "":

        return jsonify({
            "message": "No file selected"
        }), 400


    # -----------------------------------------------------
    # CHECK EXTENSION
    # -----------------------------------------------------

    if not allowed_file(file.filename):

        return jsonify({
            "message":
                "Only PDF files are allowed."
        }), 400


    # -----------------------------------------------------
    # CHECK PDF MAGIC BYTES
    # -----------------------------------------------------

    file_header = file.read(5)

    file.seek(0)

    if file_header != b"%PDF-":

        return jsonify({
            "message":
                "Invalid PDF file."
        }), 400


    # -----------------------------------------------------
    # SECURE ORIGINAL FILENAME
    # -----------------------------------------------------

    original_filename = secure_filename(
        file.filename
    )

    if not original_filename:

        return jsonify({
            "message":
                "Invalid filename."
        }), 400


    # -----------------------------------------------------
    # RANDOM SERVER FILENAME
    # -----------------------------------------------------

    random_filename = (
        str(uuid.uuid4())
        + ".pdf"
    )

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        random_filename
    )


    # -----------------------------------------------------
    # SAVE FILE
    # -----------------------------------------------------

    try:

        file.save(filepath)

    except Exception as error:

        print(
            "File save error:",
            error
        )

        return jsonify({
            "message":
                "Unable to save uploaded file."
        }), 500


    # -----------------------------------------------------
    # EXTRACT PDF TEXT
    # -----------------------------------------------------

    try:

        resume_text = extract_text(
            filepath
        )

    except Exception as error:

        print(
            "PDF extraction error:",
            error
        )

        try:

            if os.path.exists(filepath):

                os.remove(filepath)

        except Exception:
            pass

        return jsonify({
            "message":
                "Unable to read the uploaded PDF."
        }), 400


    # -----------------------------------------------------
    # CHECK WHETHER PDF IS A RESUME
    # -----------------------------------------------------

    if not is_likely_resume(
        resume_text
    ):

        try:

            if os.path.exists(filepath):

                os.remove(filepath)

        except Exception:
            pass

        return jsonify({
            "message":
                "This PDF does not appear to be a resume. Please upload a valid resume."
        }), 400


    # -----------------------------------------------------
    # EXTRACT RESUME INFORMATION
    # -----------------------------------------------------

    try:

        skills = extract_skills(
            resume_text
        )

        education = extract_education(
            resume_text
        )

        experience = extract_experience(
            resume_text
        )

        contact = extract_contact_info(
            resume_text
        )

    except Exception as error:

        print(
            "Resume extraction error:",
            error
        )

        try:

            if os.path.exists(filepath):

                os.remove(filepath)

        except Exception:
            pass

        return jsonify({
            "message":
                "Unable to analyze resume information."
        }), 500


    # =====================================================
    # JOB DESCRIPTION
    # =====================================================

    job_description = request.form.get(
        "job_description",
        ""
    )

    if job_description.strip() == "":

        job_description = """
        Looking for a Python Developer with
        Flask, React, Machine Learning,
        NLP, MongoDB,
        HTML, CSS,
        JavaScript,
        SQL and Git.
        """


    # =====================================================
    # ATS SCORE
    # =====================================================

    try:

        (
            ats_score,
            matched_skills,
            missing_skills
        ) = calculate_ats_score(
            skills,
            job_description
        )

    except Exception as error:

        print(
            "ATS analysis error:",
            error
        )

        return jsonify({
            "message":
                "ATS analysis failed."
        }), 500


    # =====================================================
    # SEMANTIC SCORE
    # =====================================================

    try:

        semantic_score = float(
            calculate_semantic_score(
                resume_text,
                job_description
            )
        )

    except Exception as error:

        print(
            "Semantic analysis error:",
            error
        )

        return jsonify({
            "message":
                "Semantic analysis failed."
        }), 500


    # =====================================================
    # RESUME GRADE
    # =====================================================

    try:

        (
            resume_grade,
            overall_score
        ) = calculate_resume_grade(
            ats_score,
            semantic_score,
            skills,
            experience,
            education
        )

        overall_score = float(
            overall_score
        )

    except Exception as error:

        print(
            "Resume grading error:",
            error
        )

        return jsonify({
            "message":
                "Resume grading failed."
        }), 500


    # =====================================================
    # AI JOB ROLE PREDICTION
    # =====================================================

    predicted_role = "Not predicted"

    role_evidence = []

    try:

        role_prediction = predict_job_role(
            skills=skills,
            education=education,
            experience=experience,
            resume_text=resume_text
        )


        # -------------------------------------------------
        # NEW PREDICTOR FORMAT
        # -------------------------------------------------

        if isinstance(
            role_prediction,
            dict
        ):

            predicted_role = role_prediction.get(
                "role",
                "Not predicted"
            )

            all_evidence = role_prediction.get(
                "evidence",
                {}
            )

            if isinstance(
                all_evidence,
                dict
            ):

                role_evidence = all_evidence.get(
                    predicted_role,
                    []
                )


        # -------------------------------------------------
        # BACKWARD COMPATIBILITY
        # -------------------------------------------------

        else:

            predicted_role = str(
                role_prediction
            )

    except Exception as error:

        print(
            "Role prediction error:",
            error
        )

        predicted_role = "Not predicted"

        role_evidence = []


    # =====================================================
    # INTERVIEW QUESTIONS
    # =====================================================

    try:

        interview_questions = (
            get_interview_questions(
                predicted_role
            )
        )

    except Exception as error:

        print(
            "Interview question error:",
            error
        )

        interview_questions = []


    # =====================================================
    # SUGGESTIONS
    # =====================================================

    try:

        suggestions = generate_suggestions(
            ats_score,
            missing_skills
        )

    except Exception as error:

        print(
            "Suggestion error:",
            error
        )

        suggestions = []


    # =====================================================
    # RESUME INSIGHTS
    # =====================================================

    try:

        resume_insights = (
            generate_resume_insights(
                skills,
                ats_score,
                education,
                experience
            )
        )

    except Exception as error:

        print(
            "Resume insights error:",
            error
        )

        resume_insights = {}


    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    return jsonify({

        "message":
            "Resume uploaded successfully!",

        "filename":
            original_filename,

        "text":
            resume_text,

        "contact":
            contact,

        "skills":
            skills,

        "education":
            education,

        "experience":
            experience,

        "ats_score":
            ats_score,

        "semantic_score":
            semantic_score,

        "resume_grade":
            resume_grade,

        "overall_score":
            overall_score,

        "predicted_role":
            predicted_role,

        "role_evidence":
            role_evidence,

        "interview_questions":
            interview_questions,

        "matched_skills":
            matched_skills,

        "missing_skills":
            missing_skills,

        "suggestions":
            suggestions,

        "resume_insights":
            resume_insights
    })


# =========================================================
# FILE TOO LARGE
# =========================================================

@app.errorhandler(413)
def request_entity_too_large(error):

    return jsonify({

        "message":
            "File is too large. Maximum allowed size is 5 MB."

    }), 413


# =========================================================
# INTERNAL SERVER ERROR
# =========================================================

@app.errorhandler(500)
def internal_server_error(error):

    return jsonify({

        "message":
            "Internal server error."

    }), 500


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    debug_mode = (
        os.getenv(
            "FLASK_DEBUG",
            "false"
        ).lower()
        == "true"
    )

    app.run(
        debug=debug_mode,
        use_reloader=False
    )