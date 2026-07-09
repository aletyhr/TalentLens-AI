from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User, bcrypt

auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if User.find_user(email):
        return jsonify({"message": "User already exists"}), 400

    User.create_user(name, email, password)

    return jsonify({"message": "Registration Successful"}), 201


@auth.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = User.find_user(email)

    if not user:
        return jsonify({"message": "Invalid Email"}), 401

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid Password"}), 401

    token = create_access_token(identity=email)

    return jsonify({
        "message": "Login Successful",
        "token": token,
        "name": user["name"]
    }), 200