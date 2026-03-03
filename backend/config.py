import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")
    ORACLE_AI_ENDPOINT = os.getenv("ORACLE_AI_ENDPOINT", "")
    ORACLE_AI_API_KEY = os.getenv("ORACLE_AI_API_KEY", "")
    ORACLE_AI_COMPARTMENT_ID = os.getenv("ORACLE_AI_COMPARTMENT_ID", "")
    ORACLE_AI_MODEL_ID = os.getenv("ORACLE_AI_MODEL_ID", "")
