import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """
    Central configuration for the Leave Service.

    - Fully environment-driven (12-factor style)
    - Supports both:
        ✅ Windows Authentication (trusted connection)
        ✅ SQL Server username/password authentication
    - Explicit control over encryption for Dev vs Production
    - NO notification logic (handled by another microservice)
    """


    # DATABASE CONFIG
   

    # Example for local dev:
    #   SQL_SERVER=localhost,1500
    SQL_SERVER: str = os.getenv("SQL_SERVER", "localhost,1500")
    SQL_DATABASE: str = os.getenv("SQL_DATABASE", "leave_db")
    SQL_USERNAME: str = os.getenv("SQL_USERNAME", "")   # empty => Windows auth
    SQL_PASSWORD: str = os.getenv("SQL_PASSWORD", "")
    SQL_DRIVER: str = os.getenv("SQL_DRIVER", "ODBC Driver 18 for SQL Server")

    # Use Windows Authentication (True) or SQL Login (False)
    SQL_AUTH_TRUSTED: bool = os.getenv("SQL_AUTH_TRUSTED", "True").lower() in ("1", "true", "yes")

    # Encryption behaviour (ODBC 18+ defaults to encrypt=yes)
    # Dev:  encrypt=False, trust_cert=True
    #  Prod: encrypt=True,  trust_cert=False (with a real SSL cert)
    SQL_ENCRYPT: bool = os.getenv("SQL_ENCRYPT", "False").lower() in ("1", "true", "yes")
    SQL_TRUST_CERT: bool = os.getenv("SQL_TRUST_CERT", "True").lower() in ("1", "true", "yes")

    # Escape driver & server for SQLAlchemy URI
    _driver_escaped = SQL_DRIVER.replace(" ", "+")
    _server_escaped = SQL_SERVER.replace("\\", "\\\\")

    _params = []

    if SQL_AUTH_TRUSTED:
        auth_part = ""
        _params.append("trusted_connection=yes")
    else:
        auth_part = f"{SQL_USERNAME}:{SQL_PASSWORD}@"

    if SQL_ENCRYPT:
        _params.append("encrypt=yes")
    else:
        _params.append("encrypt=no")

    if SQL_TRUST_CERT:
        _params.append("TrustServerCertificate=yes")

    _params_str = "&" + "&".join(_params)

    SQLALCHEMY_DATABASE_URI: str = (
        f"mssql+pyodbc://{auth_part}{_server_escaped}/{SQL_DATABASE}"
        f"?driver={_driver_escaped}{_params_str}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # OTHER MICROSERVICES

    EMPLOYEE_SERVICE_URL: str = os.getenv("EMPLOYEE_SERVICE_URL", "http://localhost:5001")
    EMPLOYEE_GET_ENDPOINT: str = os.getenv("EMPLOYEE_GET_ENDPOINT", "/api/employees")

    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:5003")
    AUTH_VERIFY_ENDPOINT: str = os.getenv("AUTH_VERIFY_ENDPOINT", "/api/auth/verify")


    # FLASK APP SETTINGS

    PORT: int = int(os.getenv("PORT", 5555))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("1", "true", "yes")
