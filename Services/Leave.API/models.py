import uuid
from datetime import datetime

from db import db


def gen_uuid() -> str:
    """Generate a new UUID as a string (for primary keys)."""
    return str(uuid.uuid4())


class Leave(db.Model):
    """
    Leave entity representing a single leave request.

    Fields:
        id           : GUID (string) primary key
        employee_id  : GUID (string) of the employee (from Employee service)
        leave_type   : 'ANNUAL', 'SICK', 'CASUAL', 'UNPAID', 'PAID'
        start_date   : First day of leave
        end_date     : Last day of leave
        reason       : Optional reason text
        status       : 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
        applied_at   : When the leave was created
        approved_by  : Admin/manager ID who approved/rejected
        approved_at  : When the approval/rejection happened
    """

    __tablename__ = "leaves"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    employee_id = db.Column(db.String(36), nullable=False, index=True)
    # Allowed values are enforced by the schema layer (marshmallow),
    # but we document them here for reference.
    leave_type = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(20),
        nullable=False,
        default="PENDING",  # 'PENDING','APPROVED','REJECTED','CANCELLED'
    )
    applied_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    approved_by = db.Column(db.String(36), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self) -> dict:
        """Serialize the Leave object to a JSON-serializable dict."""
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "leave_type": self.leave_type,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "reason": self.reason,
            "status": self.status,
            "applied_at": self.applied_at.isoformat(),
            "approved_by": self.approved_by,
            "approved_at": self.approved_at.isoformat() if self.approved_at else None,
        }
