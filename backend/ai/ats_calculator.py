def calculate_ats_score(resume_skills, job_description):

    job_description = job_description.lower()

    matched = []
    missing = []

    all_skills = [
        "python",
        "java",
        "c",
        "c++",
        "html",
        "css",
        "javascript",
        "react",
        "node",
        "flask",
        "django",
        "mongodb",
        "mysql",
        "sql",
        "machine learning",
        "deep learning",
        "artificial intelligence",
        "git",
        "github"
    ]

    for skill in resume_skills:
        if skill.lower() in job_description:
            matched.append(skill)

    for skill in all_skills:
        if skill in job_description and skill.title() not in matched:
            missing.append(skill.title())

    total = len(matched) + len(missing)

    if total == 0:
        score = 0
    else:
        score = round((len(matched) / total) * 100)

    return score, matched, missing