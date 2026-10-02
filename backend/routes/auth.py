from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
import re

from models.user import User, bcrypt
from config.extensions import limiter


auth = Blueprint(
    "auth",
    __name__
)


# =========================================================
# EMAIL VALIDATION
# =========================================================

def is_valid_email(email):

    if not isinstance(email, str):
        return False

    email = email.strip().lower()

    if len(email) > 254:
        return False

    email_pattern = (
        r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+"
        r"@"
        r"[A-Za-z0-9]"
        r"(?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
        r"(?:\.[A-Za-z0-9]"
        r"(?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$"
    )

    return re.match(
        email_pattern,
        email
    ) is not None


# =========================================================
# PASSWORD VALIDATION
# =========================================================

def is_strong_password(password):

    if not isinstance(password, str):
        return False

    if len(password) < 8:
        return False

    if len(password) > 128:
        return False

    has_uppercase = re.search(
        r"[A-Z]",
        password
    )

    has_lowercase = re.search(
        r"[a-z]",
        password
    )

    has_number = re.search(
        r"[0-9]",
        password
    )

    has_special = re.search(
        r"[^A-Za-z0-9]",
        password
    )

    return (
        has_uppercase
        and has_lowercase
        and has_number
        and has_special
    )


# =========================================================
# REGISTER
# =========================================================

@auth.route(
    "/register",
    methods=["POST"]
)
@limiter.limit("5 per minute")
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data received"
        }), 400


    name = data.get(
        "name",
        ""
    ).strip()


    email = data.get(
        "email",
        ""
    ).strip().lower()


    password = data.get(
        "password",
        ""
    )


    # -----------------------------------------------------
    # REQUIRED FIELDS
    # -----------------------------------------------------

    if not name:
        return jsonify({
            "message": "Name is required"
        }), 400


    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400


    if not password:
        return jsonify({
            "message": "Password is required"
        }), 400


    # -----------------------------------------------------
    # EMAIL FORMAT
    # -----------------------------------------------------

    if not is_valid_email(email):
        return jsonify({
            "message": "Please enter a valid email address."
        }), 400


    # -----------------------------------------------------
    # NAME VALIDATION
    # -----------------------------------------------------

    if len(name) > 100:
        return jsonify({
            "message": "Name is too long."
        }), 400


    # -----------------------------------------------------
    # PASSWORD VALIDATION
    # -----------------------------------------------------

    if len(password) < 8:
        return jsonify({
            "message": (
                "Password must be at least 8 characters long."
            )
        }), 400


    if len(password) > 128:
        return jsonify({
            "message": "Password is too long."
        }), 400


    if not is_strong_password(password):
        return jsonify({
            "message": (
                "Password must contain at least one uppercase "
                "letter, one lowercase letter, one number, "
                "and one special character."
            )
        }), 400


    # -----------------------------------------------------
    # CHECK EXISTING USER
    # -----------------------------------------------------

    if User.find_user(email):
        return jsonify({
            "message": "An account with this email already exists."
        }), 400


    # -----------------------------------------------------
    # CREATE USER
    # -----------------------------------------------------

    try:

        User.create_user(
            name,
            email,
            password
        )

    except Exception as error:

        print(
            "Registration error:",
            error
        )

        return jsonify({
            "message": "Unable to create account."
        }), 500


    return jsonify({
        "message": "Registration Successful"
    }), 201


# =========================================================
# LOGIN
# =========================================================

@auth.route(
    "/login",
    methods=["POST"]
)
@limiter.limit("5 per minute")
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data received"
        }), 400


    email = data.get(
        "email",
        ""
    ).strip().lower()


    password = data.get(
        "password",
        ""
    )


    # -----------------------------------------------------
    # REQUIRED FIELDS
    # -----------------------------------------------------

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400


    if not password:
        return jsonify({
            "message": "Password is required"
        }), 400


    # -----------------------------------------------------
    # EMAIL FORMAT
    # -----------------------------------------------------

    if not is_valid_email(email):
        return jsonify({
            "message": "Please enter a valid email address."
        }), 400


    # -----------------------------------------------------
    # FIND USER
    # -----------------------------------------------------

    user = User.find_user(email)


    if not user:
        return jsonify({
            "message": "Invalid Email or Password"
        }), 401


    # -----------------------------------------------------
    # PASSWORD CHECK
    # -----------------------------------------------------

    if not bcrypt.check_password_hash(
        user["password"],
        password
    ):
        return jsonify({
            "message": "Invalid Email or Password"
        }), 401


    # -----------------------------------------------------
    # CREATE JWT
    # -----------------------------------------------------

    token = create_access_token(
        identity=email,
        expires_delta=timedelta(
            hours=2
        )
    )


    return jsonify({

        "message": "Login Successful",

        "token": token,

        "name": user["name"]

    }), 200