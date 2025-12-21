import os
from dotenv import load_dotenv

from urllib.parse import quote_plus

load_dotenv()

class Config:
    """
    Central configuration for the Leave Service.

    - Uses SQLAlchemy + MySQL
    - Username/Password authentication
    - Fully environment-driven (12-factor)
    """

    # ==========================================================
    # DATABASE CONFIG (SQLAlchemy + MySQL)
    # ==========================================================

    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "leave_db")
    MYSQL_USERNAME: str = os.getenv("MYSQL_USERNAME", "")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")

    if not MYSQL_USERNAME or not MYSQL_PASSWORD:
        raise ValueError(
            "MYSQL_USERNAME and MYSQL_PASSWORD are required for MySQL connection"
        )

    SQLALCHEMY_DATABASE_URI: str = (
        f"mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
        "?charset=utf8mb4"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # Optional pool tuning (recommended for production)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_timeout": 30,
        "pool_recycle": 1800,
        "pool_pre_ping": True,
    }

    # ==========================================================
    # OTHER MICROSERVICES
    # ==========================================================

    EMPLOYEE_SERVICE_URL: str = os.getenv(
        "EMPLOYEE_SERVICE_URL", "http://localhost:5001"
    )
    EMPLOYEE_GET_ENDPOINT: str = os.getenv(
        "EMPLOYEE_GET_ENDPOINT", "/api/employees"
    )

    AUTH_SERVICE_URL: str = os.getenv(
        "AUTH_SERVICE_URL", "http://localhost:5003"
    )
    AUTH_VERIFY_ENDPOINT: str = os.getenv(
        "AUTH_VERIFY_ENDPOINT", "/api/auth/verify"
    )

    # ==========================================================
    # FLASK APP SETTINGS
    # ==========================================================

    PORT: int = int(os.getenv("PORT", 5555))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("1", "true", "yes")
