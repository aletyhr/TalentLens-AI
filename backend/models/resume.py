from config.database import resume_history
from datetime import datetime

class Resume:

    @staticmethod
    def save_resume(data):
        data["uploaded_at"] = datetime.utcnow()
        resume_history.insert_one(data)
    @staticmethod
    def get_history(email):
        return list(
            resume_history.find(
                {"email": email},
                {"_id": 0}
            ).sort("uploaded_at", -1)
        )