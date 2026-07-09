from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import resume_history

resume = Blueprint("resume", __name__)


# ==========================================
# Save Resume Analysis
# ==========================================

@resume.route("/save_resume", methods=["POST"])
@jwt_required()
def save_resume():

    email = get_jwt_identity()

    data = request.json

    document = {
        "email": email,
        "filename": data.get("filename"),
        "ats_score": data.get("ats_score"),
        "semantic_score": data.get("semantic_score"),
        "resume_grade": data.get("resume_grade"),
        "overall_score": data.get("overall_score"),
        "predicted_role": data.get("predicted_role"),
        "skills": data.get("skills"),
        "education": data.get("education"),
        "experience": data.get("experience"),
        "suggestions": data.get("suggestions"),
    }

    resume_history.insert_one(document)

    return jsonify({
        "message": "Resume saved successfully."
    }), 201


# ==========================================
# Resume History
# ==========================================

@resume.route("/history", methods=["GET"])
@jwt_required()
def history():

    email = get_jwt_identity()

    history = list(
        resume_history.find(
            {"email": email},
            {"_id": 0}
        )
    )

    return jsonify(history), 200