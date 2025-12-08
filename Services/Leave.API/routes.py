from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import requests

from models import Leave
from db import db
from schemas import ApplyLeaveSchema, ApproveRejectSchema

bp = Blueprint("leave", __name__, url_prefix="/api/leave")

apply_schema = ApplyLeaveSchema()
approve_schema = ApproveRejectSchema()


def common_response(success: bool, data=None, message: str = "", status_code: int | None = None):
    """
    Standard response format for all endpoints.

    {
      "success": true/false,
      "data": ... (optional),
      "message": "" or "some text"
    }
    """
    if status_code is None:
        status_code = 200 if success else 400

    payload = {
        "success": success,
        "message": message if message is not None else ""
    }
    if data is not None:
        payload["data"] = data

    return jsonify(payload), status_code


def verify_token_from_header():
    """
    Reads Bearer token from Authorization header and verifies it using the Auth service.

    Respects SKIP_AUTH flag from app.config:
      - If SKIP_AUTH=True → bypass verification (for local dev).
    Returns:
        (auth_data, None) on success
        (None, (message, status_code)) on failure
    """
    # Optional bypass for local development
    if current_app.config.get("SKIP_AUTH"):
        # You can return a dummy user object if your teammates need it
        return {"sub": "dev-skip-auth"}, None

    token = None
    auth = request.headers.get("Authorization")
    if auth and auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1]

    if not token:
        return None, ("Missing Authorization token", 401)

    # app.py builds AUTH_VERIFY_URL from AUTH_SERVICE_URL + AUTH_VERIFY_ENDPOINT
    verify_url = current_app.config.get("AUTH_VERIFY_URL")

    try:
        resp = requests.post(verify_url, json={"token": token}, timeout=5)
        if resp.status_code == 200:
            r = resp.json()
            if r.get("success"):
                return r.get("data"), None

        return None, ("Token invalid or expired", 401)
    except Exception as e:
        # For debugging; in production you might log instead of print
        print("Auth verify error:", e)
        return None, ("Auth service unavailable", 503)


@bp.route("/apply", methods=["POST"])
def apply_leave():
    json_data = request.get_json() or {}

    # Validate request
    errors = apply_schema.validate(json_data)
    if errors:
        # errors is a dict from Marshmallow, we put it in message
        return common_response(False, message=errors, status_code=400)

    # Verify JWT / auth
    auth_data, auth_error = verify_token_from_header()
    if auth_error:
        msg, status = auth_error
        return common_response(False, message=msg, status_code=status)

    # Create Leave entity
    leave = Leave(
        employee_id=json_data["employee_id"],
        leave_type=json_data["leave_type"],
        start_date=json_data["start_date"],
        end_date=json_data["end_date"],
        reason=json_data.get("reason"),
        status="PENDING",
        applied_at=datetime.utcnow()
    )

    db.session.add(leave)
    db.session.commit()

    return common_response(True, data=leave.to_dict(), message="Leave application created", status_code=201)


@bp.route("", methods=["GET"])
def get_leaves():
    """
    GET /api/leave?status=PENDING&employee_id=...&limit=...&offset=...

    Returns:
    {
      "success": true,
      "data": [ ...leave objects... ],
      "total": n,
      "limit": limit,
      "offset": offset,
      "message": ""
    }
    """
    status = request.args.get("status")
    employee_id = request.args.get("employee_id")
    limit = int(request.args.get("limit", 100))
    offset = int(request.args.get("offset", 0))

    q = Leave.query
    if status:
        q = q.filter_by(status=status.upper())
    if employee_id:
        q = q.filter_by(employee_id=employee_id)

    total = q.count()
    leaves = q.order_by(Leave.applied_at.desc()).offset(offset).limit(limit).all()
    data = [l.to_dict() for l in leaves]

    return jsonify({
        "success": True,
        "data": data,
        "total": total,
        "limit": limit,
        "offset": offset,
        "message": ""
    }), 200


@bp.route("/<leave_id>", methods=["GET"])
def get_leave_by_id(leave_id):
    leave = Leave.query.get(leave_id)
    if not leave:
        return common_response(False, message="Leave not found", status_code=404)

    return common_response(True, data=leave.to_dict(), message="")


@bp.route("/<leave_id>/approve", methods=["PUT"])
def approve_leave(leave_id):
    json_data = request.get_json() or {}

    # Validate body: using ApproveRejectSchema (status + approved_by)
    errors = approve_schema.validate(json_data)
    if errors:
        return common_response(False, message=errors, status_code=400)

    # Enforce that status in body is APPROVED for this endpoint
    if json_data.get("status") != "APPROVED":
        return common_response(False, message="Status must be 'APPROVED' for this endpoint", status_code=400)

    approved_by = json_data["approved_by"]

    # Verify admin token
    auth_data, auth_error = verify_token_from_header()
    if auth_error:
        msg, status = auth_error
        return common_response(False, message=msg, status_code=status)

    leave = Leave.query.get(leave_id)
    if not leave:
        return common_response(False, message="Leave not found", status_code=404)

    if leave.status != "PENDING":
        return common_response(False, message="Only pending leaves can be approved", status_code=400)

    leave.status = "APPROVED"
    leave.approved_by = approved_by
    leave.approved_at = datetime.utcnow()
    db.session.commit()


    return common_response(True, data=leave.to_dict(), message="Leave approved", status_code=200)


@bp.route("/<leave_id>/reject", methods=["PUT"])
def reject_leave(leave_id):
    json_data = request.get_json() or {}

    errors = approve_schema.validate(json_data)
    if errors:
        return common_response(False, message=errors, status_code=400)

    # Enforce that status in body is REJECTED for this endpoint
    if json_data.get("status") != "REJECTED":
        return common_response(False, message="Status must be 'REJECTED' for this endpoint", status_code=400)

    approved_by = json_data["approved_by"]

    # Verify admin token
    auth_data, auth_error = verify_token_from_header()
    if auth_error:
        msg, status = auth_error
        return common_response(False, message=msg, status_code=status)

    leave = Leave.query.get(leave_id)
    if not leave:
        return common_response(False, message="Leave not found", status_code=404)

    if leave.status != "PENDING":
        return common_response(False, message="Only pending leaves can be rejected", status_code=400)

    leave.status = "REJECTED"
    leave.approved_by = approved_by
    leave.approved_at = datetime.utcnow()
    db.session.commit()


    return common_response(True, data=leave.to_dict(), message="Leave rejected", status_code=200)
