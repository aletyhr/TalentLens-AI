import spacy

nlp = spacy.load("en_core_web_sm")

# Skills list
SKILLS = [
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
    "nlp",
    "git",
    "github"
]

def extract_skills(text):

    doc = nlp(text.lower())

    found_skills = []

    for skill in SKILLS:
        if skill in doc.text:
            found_skills.append(skill.title())

    return list(set(found_skills))