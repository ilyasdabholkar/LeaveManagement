# Leave Microservice — Leave Management System

This microservice is responsible for handling **employee leave requests** in the Leave Management System.  
It supports applying for leave, viewing leave records, and approving or rejecting leave requests.

It is built using:

- Flask (Python)
- SQL Server (via pyodbc + SQLAlchemy)
- Marshmallow (for validation)

This service is designed to integrate with:
Auth Service (for JWT verification)
Employee Service (for employee lookup)
Notification Service (handled separately by another teammate)

---

Responsibilities of This Service

This service handles:

- Apply for leave
- Get all leaves
- Get a leave by ID
- Approve a leave
- Reject a leave

Leave Types Supported:

- `ANNUAL`
- `SICK`
- `CASUAL`
- `UNPAID`
- `PAID`

Leave Status Values:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `CANCELLED`

---

Folder Structure :
│
├── app.py # Flask app setup
├── config.py # Environment & DB configuration
├── db.py # SQLAlchemy instance
├── models.py # Leave DB model
├── schemas.py # Request validation schemas
├── routes.py # All API routes
├── migrations/ # Alembic migrations
├── requirements.txt # Python dependencies
├── README_SERVICE.md # This documentation
└── venv/ # Virtual environment

Running the Service Locally

# Activate virtual environment

venv\Scripts\activate

# Apply migrations (only first time)

flask db upgrade

# Start the service

python app.py

API Endpoints :

1. Apply Leave
   POST /api/leave/apply

2. Get All Leaves
   GET /api/leave

3. Get Leave By ID
   GET /api/leave/{leave_id}

4. Approve Leave
   PUT /api/leave/{leave_id}/approve

5. Reject Leave
   PUT /api/leave/{leave_id}/reject

Response Format :
{
"success": true or false,
"message": "status message",
"data": {} // optional
}

For Authentication This service verifies JWT tokens using the Auth Service
Endpoint used:
POST {AUTH_SERVICE_URL}/api/auth/verify

# Database

Table: leaves

Main Fields:
id (UUID)
employee_id
leave_type
start_date
end_date
reason
status
applied_at
approved_by
approved_at
