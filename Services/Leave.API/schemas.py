# schemas.py

from marshmallow import Schema, fields, validate, ValidationError, validates_schema


# Apply Leave Schema

class ApplyLeaveSchema(Schema):
    employee_id = fields.Str(required=True)

    # Allowed leave types: 'ANNUAL', 'SICK', 'CASUAL', 'UNPAID', 'PAID'
    leave_type = fields.Str(
        required=True,
        validate=validate.OneOf(
            ["ANNUAL", "SICK", "CASUAL", "UNPAID", "PAID"],
            error="leave_type must be one of: ANNUAL, SICK, CASUAL, UNPAID, PAID",
        ),
    )

    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)

    # Optional reason, max 1000 chars
    reason = fields.Str(
        required=False,
        allow_none=True,
        validate=validate.Length(max=1000),
    )

    # Business rule validation: end_date cannot be before start_date
    @validates_schema
    def validate_dates(self, data, **kwargs):
        start = data.get("start_date")
        end = data.get("end_date")

        if start and end and end < start:
            raise ValidationError("end_date cannot be earlier than start_date")


# Approve / Reject Leave Schema

class ApproveRejectSchema(Schema):
    """
    Payload for approving / rejecting a leave.

    NOTE:
    - We only require `approved_by` here.
    - The *route* itself decides the final status:
        - /<id>/approve  -> status = APPROVED
        - /<id>/reject   -> status = REJECTED
    """

    approved_by = fields.Str(required=True)
