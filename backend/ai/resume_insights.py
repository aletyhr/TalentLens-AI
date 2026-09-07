def generate_resume_insights(skills, ats_score, education, experience):
    strengths = []
    improvements = []

    # ATS Score
    if ats_score >= 80:
        strengths.append("Excellent ATS compatibility.")
    elif ats_score >= 60:
        strengths.append("Good ATS score.")
    else:
        improvements.append("Improve ATS score by adding more keywords.")

    # Skills
    if len(skills) >= 8:
        strengths.append("Strong technical skill set.")
    else:
        improvements.append("Add more relevant technical skills.")

    # Education
    if education:
        strengths.append("Education section detected.")
    else:
        improvements.append("Add an Education section.")

    # Experience
    if experience:
        strengths.append("Experience section found.")
    else:
        improvements.append("Add internships or project experience.")

    # Generic Suggestions
    improvements.append("Include measurable achievements.")
    improvements.append("Add GitHub and LinkedIn profile links.")

    return {
        "strengths": strengths,
        "improvements": improvements
    }