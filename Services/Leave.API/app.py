from flask import Flask, jsonify
from config import Config
from db import db
from flask_migrate import Migrate
from routes import bp as leave_bp
import os
from flask_cors import CORS

migrate = Migrate()  

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

   
    # Initialize DB
    db.init_app(app)
    migrate.init_app(app, db)  # ✅ correct for app factory

    CORS(app)
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
