def generate_suggestions(score, missing_skills):

    suggestions = []

    if score < 40:
        suggestions.append("Resume requires significant improvement.")

    elif score < 70:
        suggestions.append("Resume is average. Add more relevant skills.")

    else:
        suggestions.append("Resume matches the job description well.")

    if len(missing_skills) > 0:
        suggestions.append(
            "Consider learning: " +
            ", ".join(missing_skills)
        )

    suggestions.append(
        "Use strong action verbs in your experience section."
    )

    suggestions.append(
        "Keep your resume within one page if possible."
    )

    return suggestions