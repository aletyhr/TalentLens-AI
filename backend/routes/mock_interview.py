from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from ai.mock_interview import evaluate_answer


mock_interview = Blueprint("mock_interview", __name__)


# ==========================================
# Evaluate Interview Answer
# ==========================================

@mock_interview.route("/evaluate_answer", methods=["POST"])
@jwt_required()
def evaluate_interview_answer():

    data = request.json

    question = data.get("question", "")
    answer = data.get("answer", "")

    if not question:
        return jsonify({
            "message": "Question is required"
        }), 400

    result = evaluate_answer(question, answer)

    return jsonify(result), 200