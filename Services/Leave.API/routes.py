from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import requests
from flask import request, g
from auth import jwt_required, require_role
from models import Leave
from db import db
from schemas import ApplyLeaveSchema, ApproveRejectSchema
from utils import common_response

bp = Blueprint("leave", __name__, url_prefix="/api/leave")

apply_schema = ApplyLeaveSchema()
approve_schema = ApproveRejectSchema()

@bp.route("/apply", methods=["POST"])
@jwt_required
def apply_leave():
    json_data = request.get_json() or {}

    # Validate request
    errors = apply_schema.validate(json_data)
    if errors:
        return common_response(False, message=errors, status_code=400)


    leave = Leave(
        employee_id=g.user_id,
        leave_type=json_data["leave_type"],
        start_date=json_data["start_date"],
        end_date=json_data["end_date"],
        reason=json_data.get("reason"),
        status="PENDING",
        applied_at=datetime.utcnow()
    )

    db.session.add(leave)
    db.session.commit()

    return common_response(
        True,
        data=leave.to_dict(),
        message="Leave application created",
        status_code=201
    )

@bp.route("", methods=["GET"])
@jwt_required
def get_leaves():
    """
    GET /api/leave?status=PENDING&employee_id=...&limit=...&offset=...
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
    leaves = (
        q.order_by(Leave.applied_at.desc())
         .offset(offset)
         .limit(limit)
         .all()
    )

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
@jwt_required
def get_leave_by_id(leave_id):
    leave = Leave.query.get(leave_id)

    if not leave:
        return common_response(False, message="Leave not found", status_code=404)

    return common_response(True, data=leave.to_dict())

@bp.route("/<leave_id>/approve", methods=["PUT"])
@jwt_required
@require_role("ADMIN")
def approve_leave(leave_id):
    json_data = request.get_json() or {}

    errors = approve_schema.validate(json_data)
    if errors:
        return common_response(False, message=errors, status_code=400)

    if json_data.get("status") != "APPROVED":
        return common_response(
            False,
            message="Status must be 'APPROVED' for this endpoint",
            status_code=400
        )

    leave = Leave.query.get(leave_id)
    if not leave:
        return common_response(False, message="Leave not found", status_code=404)

    if leave.status != "PENDING":
        return common_response(
            False,
            message="Only pending leaves can be approved",
            status_code=400
        )

    leave.status = "APPROVED"
    leave.approved_by = g.user_id        # 🔐 from JWT
    leave.approved_at = datetime.utcnow()

    db.session.commit()

    return common_response(
        True,
        data=leave.to_dict(),
        message="Leave approved"
    )

@bp.route("/<leave_id>/reject", methods=["PUT"])
@jwt_required
@require_role("ADMIN")
def reject_leave(leave_id):
    json_data = request.get_json() or {}

    errors = approve_schema.validate(json_data)
    if errors:
        return common_response(False, message=errors, status_code=400)

    if json_data.get("status") != "REJECTED":
        return common_response(
            False,
            message="Status must be 'REJECTED' for this endpoint",
            status_code=400
        )

    leave = Leave.query.get(leave_id)
    if not leave:
        return common_response(False, message="Leave not found", status_code=404)

    if leave.status != "PENDING":
        return common_response(
            False,
            message="Only pending leaves can be rejected",
            status_code=400
        )

    leave.status = "REJECTED"
    leave.approved_by = g.user_id        # 🔐 from JWT
    leave.approved_at = datetime.utcnow()

    db.session.commit()

    return common_response(
        True,
        data=leave.to_dict(),
        message="Leave rejected"
    )
