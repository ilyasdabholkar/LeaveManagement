import os
import jwt
from functools import wraps
from flask import request, current_app, g, jsonify
from jwt import ExpiredSignatureError, InvalidTokenError

from utils import common_response



def get_jwt_settings():
    """
    Loads JWT settings from environment variables.
    """

    return {
        "ISSUER": os.getenv("JWT_ISSUER", "leavemanagement"),
        "AUDIENCE": os.getenv("JWT_AUDIENCE", "leavemanagement_users"),
        "SECRET": os.getenv("JWT_SECRET"),  
        "ALGORITHM": os.getenv("JWT_ALGORITHM", "HS256"),
    }

def verify_token_from_header():
    """
    Reads Bearer token from Authorization header and verifies JWT.

    Respects SKIP_AUTH flag:
      - If SKIP_AUTH=True → bypass verification (local/dev)

    Returns:
        (claims, None) on success
        (None, (message, status_code)) on failure
    """

    # Optional bypass for local development
    if current_app.config.get("SKIP_AUTH"):
        return {
            "sub": "dev-user",
            "uid": "dev@example.com",
            "role": "ADMIN",
        }, None

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.lower().startswith("bearer "):
        return None, ("Missing Authorization token", 401)

    token = auth_header.split(" ", 1)[1]

    jwt_cfg = get_jwt_settings()

    if not jwt_cfg["SECRET"]:
        return None, ("JWT_SECRET not configured", 500)

    try:
        payload = jwt.decode(
            token,
            jwt_cfg["SECRET"],
            algorithms=[jwt_cfg["ALGORITHM"]],
            audience=jwt_cfg["AUDIENCE"],
            issuer=jwt_cfg["ISSUER"],
        )

        return payload, None

    except ExpiredSignatureError:
        return None, ("Token expired", 401)

    except InvalidTokenError as e:
        return None, (f"Invalid token: {str(e)}", 401)

def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        claims, error = verify_token_from_header()

        if error:
            msg, status = error
            return common_response(False, message=msg, status_code=status)

        g.jwt_claims = claims
        g.sub = claims.get("sub")
        g.user_id = claims.get("dbId")
        g.role = claims.get("role")
        g.email = claims.get("uid")

        return fn(*args, **kwargs)

    return wrapper

def require_role(required_role):
    """
    Enforces role-based access control
    Usage: @require_role("ADMIN")
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if not hasattr(g, "role"):
                return jsonify({"error": "Unauthorized"}), 401

            if g.role != required_role:
                return jsonify({"error": "Forbidden"}), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator
