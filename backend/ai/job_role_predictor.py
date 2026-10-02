import re


def normalize_text(value):
    """
    Convert text to lowercase and normalize whitespace.
    """
    return re.sub(
        r"\s+",
        " ",
        str(value or "").lower().strip()
    )


def contains_any(text, phrases):
    """
    Check whether any phrase exists in text.
    """
    for phrase in phrases:
        if phrase in text:
            return True

    return False


def count_matches(text, phrases):
    """
    Count how many phrases are present in the text.
    """
    count = 0

    for phrase in phrases:
        if phrase in text:
            count += 1

    return count


def predict_job_role(
    skills,
    education=None,
    experience=None,
    resume_text=""
):
    """
    Explainable job-role prediction.

    Uses:
        1. Skills
        2. Education
        3. Experience
        4. Complete resume text

    Returns:
        Predicted job role as a string.
    """

    # =====================================================
    # SAFE INPUT HANDLING
    # =====================================================

    if not isinstance(skills, list):
        skills = []

    if not isinstance(education, list):
        education = []

    if not isinstance(experience, list):
        experience = []

    # =====================================================
    # NORMALIZE SKILLS
    # =====================================================

    normalized_skills = []

    for skill in skills:

        value = normalize_text(skill)

        if value:
            normalized_skills.append(value)

    # Remove duplicates
    normalized_skills = list(
        dict.fromkeys(
            normalized_skills
        )
    )

    # =====================================================
    # BUILD COMPLETE RESUME TEXT
    # =====================================================

    education_text = " ".join(
        str(item)
        for item in education
    )

    experience_text = " ".join(
        str(item)
        for item in experience
    )

    skill_text = " ".join(
        normalized_skills
    )

    complete_text = " ".join(
        [
            str(resume_text or ""),
            skill_text,
            education_text,
            experience_text
        ]
    )

    text = normalize_text(
        complete_text
    )

    # =====================================================
    # ROLE LIST
    # =====================================================

    roles = [
        "Data Analyst",
        "Data Scientist",
        "BI Analyst",
        "Business Analyst",
        "AI / ML Engineer",
        "Backend Developer",
        "Frontend Developer",
        "Full Stack Developer",
        "Database Developer",
        "Software Developer"
    ]

    scores = {}

    evidence = {}

    for role in roles:
        scores[role] = 0
        evidence[role] = []

    # =====================================================
    # HELPER
    # =====================================================

    def add_score(
        role,
        points,
        reason
    ):
        scores[role] += points

        if reason not in evidence[role]:
            evidence[role].append(
                reason
            )

    # =====================================================
    # DATA ANALYST
    # =====================================================

    data_analyst_skills = {
        "tableau": 8,
        "power bi": 8,
        "data analysis": 8,
        "data analytics": 8,
        "data visualization": 7,
        "statistics": 7,
        "excel": 5,
        "vba": 5,
        "sql": 4,
        "mysql": 3,
        "pandas": 4,
        "numpy": 2,
        "jupyter": 3,
        "etl": 6,
        "data cleaning": 6,
        "data preprocessing": 6,
        "time series": 7,
        "forecasting": 6,
        "business intelligence": 6,
        "python": 2,
        "r": 4,
        "matplotlib": 3,
        "seaborn": 3,
        "plotly": 3
    }

    for skill, points in data_analyst_skills.items():

        if skill in normalized_skills:

            add_score(
                "Data Analyst",
                points,
                f"Skill: {skill}"
            )

    data_analyst_phrases = [
        "data analyst",
        "data analyst intern",
        "data analytics",
        "data analysis",
        "data visualization",
        "data cleaning",
        "data preprocessing",
        "business insights",
        "dashboard",
        "dashboards",
        "time series analysis",
        "forecasting",
        "etl",
        "insurance claims"
    ]

    for phrase in data_analyst_phrases:

        if phrase in text:

            add_score(
                "Data Analyst",
                8,
                f"Resume evidence: {phrase}"
            )

    # Strong context boost
    analyst_context = [
        "data analyst",
        "data analyst intern",
        "data analytics",
        "data analysis",
        "tableau",
        "power bi",
        "statistics",
        "data visualization",
        "time series",
        "etl"
    ]

    analyst_context_count = count_matches(
        text,
        analyst_context
    )

    if analyst_context_count >= 3:

        add_score(
            "Data Analyst",
            15,
            "Strong data-analytics career context"
        )

    # =====================================================
    # DATA SCIENTIST
    # =====================================================

    data_scientist_skills = {
        "machine learning": 8,
        "deep learning": 8,
        "scikit-learn": 7,
        "tensorflow": 7,
        "pytorch": 7,
        "nlp": 7,
        "natural language processing": 7,
        "computer vision": 7,
        "predictive modeling": 7,
        "statistical modeling": 6,
        "feature engineering": 6,
        "pandas": 4,
        "numpy": 4,
        "python": 3,
        "r": 3,
        "statistics": 4
    }

    for skill, points in data_scientist_skills.items():

        if skill in normalized_skills:

            add_score(
                "Data Scientist",
                points,
                f"Skill: {skill}"
            )

    data_scientist_phrases = [
        "data scientist",
        "data science",
        "machine learning project",
        "machine learning model",
        "predictive model",
        "predictive modeling",
        "classification model",
        "regression model",
        "feature engineering"
    ]

    for phrase in data_scientist_phrases:

        if phrase in text:

            add_score(
                "Data Scientist",
                8,
                f"Resume evidence: {phrase}"
            )

    # =====================================================
    # BI ANALYST
    # =====================================================

    bi_skills = {
        "tableau": 7,
        "power bi": 7,
        "business intelligence": 8,
        "data visualization": 6,
        "dashboard": 6,
        "dashboards": 6,
        "reporting": 5,
        "excel": 4,
        "vba": 4,
        "sql": 3
    }

    for skill, points in bi_skills.items():

        if skill in normalized_skills:

            add_score(
                "BI Analyst",
                points,
                f"BI skill: {skill}"
            )

    bi_phrases = [
        "business intelligence",
        "bi analyst",
        "bi dashboard",
        "bi dashboards",
        "dashboard development",
        "reporting dashboard"
    ]

    for phrase in bi_phrases:

        if phrase in text:

            add_score(
                "BI Analyst",
                8,
                f"Resume evidence: {phrase}"
            )

    # =====================================================
    # BUSINESS ANALYST
    # =====================================================

    business_skills = {
        "business analysis": 8,
        "requirements analysis": 8,
        "requirements gathering": 8,
        "business requirements": 7,
        "process analysis": 6,
        "business intelligence": 5,
        "data analysis": 4,
        "reporting": 4,
        "excel": 3,
        "tableau": 3,
        "power bi": 3
    }

    for skill, points in business_skills.items():

        if skill in normalized_skills:

            add_score(
                "Business Analyst",
                points,
                f"Skill: {skill}"
            )

    business_phrases = [
        "business analyst",
        "business analysis",
        "business requirements",
        "requirements gathering",
        "business insights",
        "process improvement"
    ]

    for phrase in business_phrases:

        if phrase in text:

            add_score(
                "Business Analyst",
                8,
                f"Resume evidence: {phrase}"
            )

    # =====================================================
    # AI / ML ENGINEER
    # =====================================================

    ai_skills = {
        "artificial intelligence": 8,
        "machine learning": 7,
        "deep learning": 8,
        "tensorflow": 8,
        "pytorch": 8,
        "nlp": 7,
        "natural language processing": 7,
        "computer vision": 7,
        "transformers": 7,
        "generative ai": 7,
        "llm": 7,
        "scikit-learn": 6
    }

    for skill, points in ai_skills.items():

        if skill in normalized_skills:

            add_score(
                "AI / ML Engineer",
                points,
                f"AI/ML skill: {skill}"
            )

    ai_phrases = [
        "ai engineer",
        "machine learning engineer",
        "artificial intelligence",
        "deep learning project",
        "nlp project",
        "computer vision project",
        "generative ai"
    ]

    for phrase in ai_phrases:

        if phrase in text:

            add_score(
                "AI / ML Engineer",
                9,
                f"Resume evidence: {phrase}"
            )

    # =====================================================
    # BACKEND DEVELOPER
    # =====================================================

    backend_specific = {
        "flask": 9,
        "django": 9,
        "fastapi": 9,
        "node": 9,
        "node.js": 9,
        "express": 9,
        "spring": 9,
        "spring boot": 9,
        "rest api": 9,
        "restful api": 9,
        "api development": 9,
        "backend development": 10,
        "microservices": 8
    }

    backend_supporting = {
        "mongodb": 3,
        "mysql": 2,
        "postgresql": 3,
        "redis": 3,
        "sql": 1,
        "python": 1,
        "java": 1
    }

    for skill, points in backend_specific.items():

        if skill in normalized_skills:

            add_score(
                "Backend Developer",
                points,
                f"Backend skill: {skill}"
            )

    for skill, points in backend_supporting.items():

        if skill in normalized_skills:

            add_score(
                "Backend Developer",
                points,
                f"Backend supporting skill: {skill}"
            )

    backend_phrases = [
        "backend developer",
        "backend development",
        "server-side development",
        "rest api",
        "api development",
        "web services",
        "microservices"
    ]

    for phrase in backend_phrases:

        if phrase in text:

            add_score(
                "Backend Developer",
                10,
                f"Resume evidence: {phrase}"
            )

    # =====================================================
    # IMPORTANT BACKEND PROTECTION
    # =====================================================

    backend_specialization = [
        "flask",
        "django",
        "fastapi",
        "node",
        "node.js",
        "express",
        "spring",
        "spring boot",
        "rest api",
        "restful api",
        "api development",
        "backend development",
        "microservices"
    ]

    has_backend_specialization = any(
        skill in normalized_skills
        for skill in backend_specialization
    )

    if not has_backend_specialization:

        scores["Backend Developer"] = min(
            scores["Backend Developer"],
            7
        )

    # =====================================================
    # FRONTEND DEVELOPER
    # =====================================================

    frontend_skills = {
        "html": 5,
        "css": 5,
        "javascript": 7,
        "react": 8,
        "angular": 8,
        "vue": 8,
        "typescript": 7,
        "next.js": 7,
        "bootstrap": 4,
        "tailwind": 4
    }

    for skill, points in frontend_skills.items():

        if skill in normalized_skills:

            add_score(
                "Frontend Developer",
                points,
                f"Frontend skill: {skill}"
            )

    frontend_phrases = [
        "frontend developer",
        "frontend development",
        "front-end development",
        "ui development",
        "user interface development"
    ]

    for phrase in frontend_phrases:

        if phrase in text:

            add_score(
                "Frontend Developer",
                10,
                f"Resume evidence: {phrase}"
            )

    # =====================================================
    # FULL STACK DEVELOPER
    # =====================================================

    full_stack_phrases = [
        "full stack",
        "full-stack",
        "full stack developer",
        "full-stack developer"
    ]

    for phrase in full_stack_phrases:

        if phrase in text:

            add_score(
                "Full Stack Developer",
                15,
                f"Resume evidence: {phrase}"
            )

    frontend_stack = [
        "react",
        "angular",
        "vue"
    ]

    backend_stack = [
        "flask",
        "django",
        "fastapi",
        "node",
        "node.js",
        "express",
        "spring",
        "spring boot"
    ]

    frontend_count = sum(
        1
        for skill in frontend_stack
        if skill in normalized_skills
    )

    backend_count = sum(
        1
        for skill in backend_stack
        if skill in normalized_skills
    )

    if (
        frontend_count >= 1
        and backend_count >= 1
    ):

        add_score(
            "Full Stack Developer",
            15,
            "Frontend and backend technologies detected"
        )

    # =====================================================
    # DATABASE DEVELOPER
    # =====================================================

    database_skills = {
        "mysql": 6,
        "postgresql": 6,
        "oracle": 6,
        "sql server": 6,
        "pl/sql": 7,
        "database design": 7,
        "stored procedures": 7,
        "database development": 8
    }

    for skill, points in database_skills.items():

        if skill in normalized_skills:

            add_score(
                "Database Developer",
                points,
                f"Database skill: {skill}"
            )

    database_phrases = [
        "database developer",
        "database development",
        "database design",
        "stored procedure",
        "stored procedures"
    ]

    for phrase in database_phrases:

        if phrase in text:

            add_score(
                "Database Developer",
                9,
                f"Resume evidence: {phrase}"
            )

    # =====================================================
    # SOFTWARE DEVELOPER
    # =====================================================

    software_skills = {
        "java": 3,
        "python": 2,
        "c++": 3,
        "c#": 3,
        "javascript": 3,
        "software development": 5,
        "object oriented programming": 4
    }

    for skill, points in software_skills.items():

        if skill in normalized_skills:

            add_score(
                "Software Developer",
                points,
                f"Programming skill: {skill}"
            )

    # =====================================================
    # EDUCATION CONTEXT
    # =====================================================

    education_lower = normalize_text(
        education_text
    )

    if contains_any(
        education_lower,
        [
            "data science",
            "data analytics",
            "statistics",
            "business analytics"
        ]
    ):

        add_score(
            "Data Analyst",
            5,
            "Education related to analytics/data"
        )

    if contains_any(
        education_lower,
        [
            "computer science",
            "information technology",
            "computer engineering"
        ]
    ):

        add_score(
            "Software Developer",
            3,
            "Computer/IT education"
        )

    # =====================================================
    # EXPERIENCE CONTEXT
    # =====================================================

    experience_lower = normalize_text(
        experience_text
    )

    if "data analyst" in experience_lower:

        add_score(
            "Data Analyst",
            15,
            "Data Analyst experience detected"
        )

    if "business analyst" in experience_lower:

        add_score(
            "Business Analyst",
            15,
            "Business Analyst experience detected"
        )

    if "software developer" in experience_lower:

        add_score(
            "Software Developer",
            12,
            "Software Developer experience detected"
        )

    if "backend developer" in experience_lower:

        add_score(
            "Backend Developer",
            15,
            "Backend Developer experience detected"
        )

    if "frontend developer" in experience_lower:

        add_score(
            "Frontend Developer",
            15,
            "Frontend Developer experience detected"
        )

    if "data scientist" in experience_lower:

        add_score(
            "Data Scientist",
            15,
            "Data Scientist experience detected"
        )

    # =====================================================
    # FALLBACK
    # =====================================================

    highest_score = max(
        scores.values()
    )

    if highest_score <= 0:

        return "General Software Developer"

    # =====================================================
    # SELECT ROLE
    # =====================================================

    best_role = max(
        scores,
        key=scores.get
    )

    # =====================================================
    # DEBUG OUTPUT
    # =====================================================

    print(
        "\n========== ROLE PREDICTION =========="
    )

    for role, score in sorted(
        scores.items(),
        key=lambda item: item[1],
        reverse=True
    ):

        print(
            f"{role}: {score}"
        )

    print(
        f"Predicted role: {best_role}"
    )

    print(
        "Evidence:"
    )

    for item in evidence[best_role]:

        print(
            f"  - {item}"
        )

    print(
        "====================================\n"
    )

    return {
    "role": best_role,
    "evidence": evidence
}