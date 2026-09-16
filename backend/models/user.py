from config.database import users
from flask_bcrypt import Bcrypt


bcrypt = Bcrypt()


class User:

    @staticmethod
    def create_user(name, email, password):

        hashed_password = (
            bcrypt.generate_password_hash(password)
            .decode("utf-8")
        )

        user = {
            "name": name,
            "email": email.lower(),
            "password": hashed_password
        }

        users.insert_one(user)


    @staticmethod
    def find_user(email):

        return users.find_one({
            "email": email.lower()
        })