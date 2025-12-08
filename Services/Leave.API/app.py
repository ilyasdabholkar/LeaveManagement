from flask import Flask, jsonify
from config import Config
from db import db
from flask_migrate import Migrate
from routes import bp as leave_bp
import os


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    Migrate(app, db)

    # Build full Auth verify URL for routes.verify_token_from_header
    # AUTH_SERVICE_URL + AUTH_VERIFY_ENDPOINT  (from Config / env)
    auth_verify_endpoint = app.config.get("AUTH_VERIFY_ENDPOINT", "/api/auth/verify")
    app.config["AUTH_VERIFY_URL"] = app.config.get("AUTH_SERVICE_URL", "http://localhost:5003").rstrip("/") + auth_verify_endpoint

    # Optional: allow skipping auth locally by setting SKIP_AUTH=True in .env
    # Useful when Auth service is not running on your machine.
    app.config["SKIP_AUTH"] = os.getenv("SKIP_AUTH", "False").lower() in ("1", "true", "yes")

    # Register Leave blueprint
    app.register_blueprint(leave_bp)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"success": True, "message": "Leave Service healthy"}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5555))
    # Use gunicorn in production; below is for local dev only
    app.run(host="0.0.0.0", port=port, debug=app.config["DEBUG"])
