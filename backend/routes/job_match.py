from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config.extensions import limiter

from ai.skill_extractor import extract_skills
from ai.ats_calculator import calculate_ats_score
from ai.semantic_matcher import calculate_semantic_score


job_match = Blueprint(
    "job_match",
    __name__
)


@job_match.route("/job_match", methods=["POST"])
@jwt_required()
@limiter.limit("10 per minute")
def job_match_analysis():

    data = request.get_json() or {}

    resume_text = data.get("resume_text", "")
    job_description = data.get("job_description", "")

    if not isinstance(resume_text, str):
        return jsonify({
            "message": "Invalid resume text."
        }), 400

    if not isinstance(job_description, str):
        return jsonify({
            "message": "Invalid job description."
        }), 400

    resume_text = resume_text.strip()
    job_description = job_description.strip()

    if not resume_text:
        return jsonify({
            "message": "Resume text is required."
        }), 400

    if not job_description:
        return jsonify({
            "message": "Job description is required."
        }), 400

    if len(resume_text) > 100000:
        return jsonify({
            "message": "Resume text is too long."
        }), 400

    if len(job_description) > 30000:
        return jsonify({
            "message": "Job description is too long."
        }), 400

    try:
        resume_skills = extract_skills(resume_text)
    except Exception as error:
        print("Job match skill extraction error:", error)

        return jsonify({
            "message": "Unable to extract resume skills."
        }), 500

    try:
        (
            ats_score,
            matched_skills,
            missing_skills
        ) = calculate_ats_score(
            resume_skills,
            job_description
        )
    except Exception as error:
        print("Job match ATS error:", error)

        return jsonify({
            "message": "Unable to calculate job match."
        }), 500

    try:
        semantic_score = float(
            calculate_semantic_score(
                resume_text,
                job_description
            )
        )
    except Exception as error:
        print("Job match semantic error:", error)

        return jsonify({
            "message": "Unable to calculate semantic match."
        }), 500

    ats_score = max(
        0,
        min(100, float(ats_score))
    )

    semantic_score = max(
        0,
        min(100, semantic_score)
    )

    match_score = round(
        (ats_score * 0.60) +
        (semantic_score * 0.40),
        2
    )

    if match_score >= 80:
        match_level = "Excellent Match"
    elif match_score >= 65:
        match_level = "Strong Match"
    elif match_score >= 50:
        match_level = "Moderate Match"
    elif match_score >= 35:
        match_level = "Low Match"
    else:
        match_level = "Very Low Match"

    matched_skills = [
        str(skill)
        for skill in matched_skills
        if str(skill).strip()
    ]

    missing_skills = [
        str(skill)
        for skill in missing_skills
        if str(skill).strip()
    ]

    recommendations = []

    if missing_skills:
        recommendations.append(
            "Focus on the missing skills that are explicitly "
            "required in the job description."
        )

    if ats_score < 70:
        recommendations.append(
            "Improve keyword alignment between your resume "
            "and the target job description."
        )

    if semantic_score < 70:
        recommendations.append(
            "Add more relevant project and experience details "
            "that directly relate to the target role."
        )

    if not recommendations:
        recommendations.append(
            "Your resume has strong alignment with this job description."
        )

    return jsonify({
        "message": "Job description analyzed successfully.",
        "match_score": match_score,
        "match_level": match_level,
        "ats_score": round(ats_score, 2),
        "semantic_score": round(semantic_score, 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendations": recommendations
    }), 200