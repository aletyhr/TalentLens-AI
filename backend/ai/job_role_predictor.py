def predict_job_role(skills):

    skills = [skill.lower() for skill in skills]

    roles = {

        "AI / ML Engineer": [
            "python",
            "machine learning",
            "deep learning",
            "artificial intelligence",
            "tensorflow",
            "pytorch",
            "nlp"
        ],

        "Data Scientist": [
            "python",
            "pandas",
            "numpy",
            "matplotlib",
            "sql",
            "machine learning"
        ],

        "Full Stack Developer": [
            "html",
            "css",
            "javascript",
            "react",
            "node",
            "mongodb"
        ],

        "Frontend Developer": [
            "html",
            "css",
            "javascript",
            "react",
            "bootstrap"
        ],

        "Backend Developer": [
            "python",
            "flask",
            "django",
            "mysql",
            "mongodb",
            "sql"
        ]

    }

    best_role = "General Software Developer"
    highest_score = 0

    for role, required_skills in roles.items():

        score = len(
            set(skills).intersection(required_skills)
        )

        if score > highest_score:
            highest_score = score
            best_role = role

    return best_role