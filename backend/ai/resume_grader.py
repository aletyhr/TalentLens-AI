def calculate_resume_grade(
    ats_score,
    semantic_score,
    skills,
    experience,
    education
):
    score = 0

    # ATS Score (40 Marks)
    score += ats_score * 0.40

    # Semantic Match (30 Marks)
    score += semantic_score * 0.30

    # Skills (15 Marks)
    if len(skills) >= 10:
        score += 15
    elif len(skills) >= 7:
        score += 12
    elif len(skills) >= 5:
        score += 8
    elif len(skills) >= 3:
        score += 5

    # Experience (10 Marks)
    if len(experience) > 0:
        score += 10

    # Education (5 Marks)
    if len(education) > 0:
        score += 5

    score = round(score)

    if score >= 90:
        grade = "A+"
    elif score >= 80:
        grade = "A"
    elif score >= 70:
        grade = "B+"
    elif score >= 60:
        grade = "B"
    elif score >= 50:
        grade = "C"
    else:
        grade = "D"

    return grade, score