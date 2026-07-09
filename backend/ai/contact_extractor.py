import re


def extract_contact_info(text):

    contact = {
        "name": "",
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": ""
    }

    # Email
    email = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    if email:
        contact["email"] = email.group()

    # Phone
    phone = re.search(
        r"(\+91[-\s]?)?[6-9]\d{9}",
        text
    )

    if phone:
        contact["phone"] = phone.group()

    # LinkedIn
    linkedin = re.search(
        r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+",
        text
    )

    if linkedin:
        contact["linkedin"] = linkedin.group()

    # GitHub
    github = re.search(
        r"(https?://)?(www\.)?github\.com/[A-Za-z0-9_-]+",
        text
    )

    if github:
        contact["github"] = github.group()

    # Name (simple approach)
    lines = text.split("\n")

    for line in lines:
        line = line.strip()

        if (
            len(line.split()) >= 2
            and len(line.split()) <= 4
            and "@" not in line
            and not any(char.isdigit() for char in line)
        ):
            contact["name"] = line
            break

    return contact