from pymongo import MongoClient
from dotenv import load_dotenv
import os


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# MONGODB CONFIGURATION
# =========================================================

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")


# =========================================================
# VALIDATE ENVIRONMENT VARIABLES
# =========================================================

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is not configured in the environment."
    )


if not DATABASE_NAME:
    raise RuntimeError(
        "DATABASE_NAME is not configured in the environment."
    )


# =========================================================
# MONGODB CLIENT
# =========================================================

client = MongoClient(
    MONGO_URI,

    # Connection timeout
    serverSelectionTimeoutMS=10000,

    # TLS encryption
    tls=True,

    # Connection pool limits
    maxPoolSize=50,
    minPoolSize=5,

    # Prevent connections from staying
    # idle for an excessively long time
    maxIdleTimeMS=60000,

    # Wait for a socket from the pool
    waitQueueTimeoutMS=10000,

    # Network timeout
    connectTimeoutMS=10000,
    socketTimeoutMS=10000
)


# =========================================================
# DATABASE
# =========================================================

db = client[DATABASE_NAME]


# =========================================================
# COLLECTIONS
# =========================================================

users = db["users"]

resume_history = db["resume_history"]

interview_history = db["interview_history"]