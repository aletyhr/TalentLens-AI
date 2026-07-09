import re

def extract_education(text):

    education_keywords = [
        "b.tech",
        "b.e",
        "bachelor",
        "m.tech",
        "m.e",
        "master",
        "mba",
        "bca",
        "mca",
        "b.sc",
        "m.sc",
        "phd",
        "ssc",
        "hsc",
        "intermediate",
        "computer science",
        "information technology"
    ]

    found = []

    lower_text = text.lower()

    for keyword in education_keywords:
        if keyword in lower_text:
            found.append(keyword.title())

    return list(set(found))