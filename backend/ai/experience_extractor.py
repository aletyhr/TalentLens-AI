import re

def extract_experience(text):

    pattern = r'(\d+)\+?\s*(years|year|yrs|yr)'

    matches = re.findall(pattern, text.lower())

    experience = []

    for match in matches:
        experience.append(match[0] + " Years")

    return list(set(experience))