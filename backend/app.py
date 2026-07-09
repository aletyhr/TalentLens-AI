from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# -----------------------------
# Load Environment Variables
# -----------------------------
load_dotenv()

# -----------------------------
# Authentication
# -----------------------------
from models.user import bcrypt
from routes.auth import auth
from routes.resume import resume

# -----------------------------
# Utilities
# -----------------------------
from utils.pdf_reader import extract_text

# -----------------------------
# AI Modules
# -----------------------------
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

# -----------------------------
# Flask App
# -----------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------
# JWT Configuration
# -----------------------------
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

# JWT Error Handlers
@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"message": error}), 401


@jwt.unauthorized_loader
def unauthorized_callback(error):
    return jsonify({"message": error}), 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "Token has expired"}), 401


bcrypt.init_app(app)

# -----------------------------
# Register Routes
# -----------------------------
app.register_blueprint(auth)
app.register_blueprint(resume)

# -----------------------------
# Upload Folder
# -----------------------------
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =====================================================
# HOME
# =====================================================

@app.route("/")
def home():
    return jsonify({
        "message": "TalentLens AI Backend Running Successfully!"
    })

# =====================================================
# RESUME UPLOAD API
# =====================================================

@app.route("/upload", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        file.filename
    )

    file.save(filepath)

    resume_text = extract_text(filepath)

    skills = extract_skills(resume_text)
    education = extract_education(resume_text)
    experience = extract_experience(resume_text)
    contact = extract_contact_info(resume_text)

    job_description = request.form.get("job_description", "")

    if job_description.strip() == "":
        job_description = """
        Looking for a Python Developer with
        Flask, React, Machine Learning,
        NLP, MongoDB,
        HTML, CSS,
        JavaScript,
        SQL and Git.
        """

    ats_score, matched_skills, missing_skills = calculate_ats_score(
        skills,
        job_description
    )

    semantic_score = float(
        calculate_semantic_score(
            resume_text,
            job_description
        )
    )

    resume_grade, overall_score = calculate_resume_grade(
        ats_score,
        semantic_score,
        skills,
        experience,
        education
    )

    overall_score = float(overall_score)

    predicted_role = predict_job_role(skills)
    interview_questions = get_interview_questions(predicted_role)
    print("Predicted Role:", repr(predicted_role))
    print("Interview Questions:", interview_questions)

    suggestions = generate_suggestions(
        ats_score,
        missing_skills
    )

    return jsonify({

        "message": "Resume uploaded successfully!",

        "text": resume_text,

        "contact": contact,

        "skills": skills,

        "education": education,

        "experience": experience,

        "ats_score": ats_score,

        "semantic_score": semantic_score,

        "resume_grade": resume_grade,

        "overall_score": overall_score,

        "predicted_role": predicted_role,
        "interview_questions": interview_questions,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "suggestions": suggestions

    })


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)