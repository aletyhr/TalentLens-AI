from config.database import MONGO_URI

print(MONGO_URI[:20])
print("mongodb+srv" in MONGO_URI)