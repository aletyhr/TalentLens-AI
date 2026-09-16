from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from models.user import User, bcrypt


auth = Blueprint("auth", __name__)


# ==========================================
# REGISTER
# ==========================================

@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data received"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Validation
    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    if User.find_user(email):
        return jsonify({
            "message": "User already exists"
        }), 400

    User.create_user(
        name,
        email,
        password
    )

    return jsonify({
        "message": "Registration Successful"
    }), 201


# ==========================================
# LOGIN
# ==========================================

@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data received"
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Validation
    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    user = User.find_user(email)

    if not user:
        return jsonify({
            "message": "Invalid Email or Password"
        }), 401

    if not bcrypt.check_password_hash(
        user["password"],
        password
    ):
        return jsonify({
            "message": "Invalid Email or Password"
        }), 401

    token = create_access_token(
        identity=email
    )

    return jsonify({
        "message": "Login Successful",
        "token": token,
        "name": user["name"]
    }), 200