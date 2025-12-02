# Leave Management System

A comprehensive microservices-based Leave Management System with complete notification infrastructure and modern web interface.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [How It Works](#how-it-works)
- [Services Documentation](#services-documentation)
  - [API Gateway](#1-api-gateway)
  - [Auth Service](#2-auth-service)
  - [Employee Service](#3-employee-service)
  - [Leave Service](#4-leave-service)
  - [Notification Service](#5-notification-service)
- [Frontend Application](#frontend-application)
- [Setup & Installation](#setup--installation)
- [Developer Integration Guide](#developer-integration-guide)
- [API Documentation](#api-documentation)

---

## 🎯 Project Overview

### What is This Project?

The Leave Management System is a distributed microservices application designed to manage employee leave requests, approvals, and notifications. It provides a complete solution for organizations to track and manage employee time-off requests efficiently.

### Key Features

- **Authentication & Authorization**: Secure login with JWT tokens and role-based access control (Admin/Employee)
- **Employee Management**: Complete CRUD operations for employee data
- **Leave Management**: Apply, approve, reject, and track leave requests
- **Notification System**: Automated email and SMS notifications for important events
- **Real-time Dashboard**: Comprehensive dashboards for both admins and employees
- **Audit Logs**: Complete notification history stored in MongoDB

### Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, .NET Core (C#), Python (Flask)
- **Frontend**: React.js, TailwindCSS, Axios
- **Email**: NodeMailer (SMTP)
- **SMS**: Twilio
- **Database**: MongoDB (Notifications), SQL Server (Auth, Employee, Leave)
- **API Gateway**: Express.js proxy

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend UI (React)                      │
│                      Port: 3000                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Express)                     │
│                      Port: 8080                             │
│                                                              │
│  Routes all requests to appropriate microservices           │
└───┬──────────────┬──────────────┬──────────────┬───────────┘
    │              │              │              │
    ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
│   Auth   │  │ Employee │  │   Leave  │  │ Notification │
│ Service  │  │ Service  │  │ Service  │  │   Service    │
│  :5265   │  │  :5219   │  │  :5555   │  │    :5004     │
│  (.NET)  │  │  (.NET)  │  │ (Python) │  │  (Node.js)   │
└──────────┘  └──────────┘  └──────────┘  └──────────────┘
    │              │              │              │
    │              │              │              ▼
    │              │              │         ┌──────────┐
    │              │              │         │ MongoDB  │
    │              │              │         │  :27017  │
    │              │              │         └──────────┘
    ▼              ▼              ▼
┌──────────────────────────────────────┐
│          SQL Server Database         │
│      (Auth, Employee, Leave)         │
└──────────────────────────────────────┘
```

### Architecture Principles

- **Microservices**: Each service is independent and can be developed, deployed, and scaled separately
- **API Gateway**: Single entry point for all client requests, handles routing and CORS
- **Service Communication**: RESTful APIs for inter-service communication
- **Database per Service**: Each service has its own database (except Notification Service uses MongoDB)
- **Stateless Services**: All services are stateless, enabling horizontal scaling

---

## 🔄 How It Works

### Request Flow

1. **User Login**
   - User enters credentials in React frontend
   - Frontend calls API Gateway: `POST /api/auth/login`
   - Gateway routes to Auth Service (Port 5265)
   - Auth Service validates credentials, generates JWT token
   - Token returned to frontend and stored in localStorage
   - Frontend redirects based on role (Admin → `/admin/dashboard`, Employee → `/employee/dashboard`)

2. **Leave Application**
   - Employee fills leave form in React frontend
   - Frontend calls: `POST /api/leave/apply` via Gateway
   - Gateway routes to Leave Service (Port 5555)
   - Leave Service creates leave request in database
   - Leave Service calls Notification Service: `POST /notifications/send-email`
   - Notification Service sends email and logs to MongoDB

3. **Leave Approval**
   - Admin reviews leave in dashboard
   - Admin clicks approve/reject
   - Frontend calls: `PUT /api/leave/{id}/approve` via Gateway
   - Gateway routes to Leave Service
   - Leave Service updates status in database
   - Leave Service calls Notification Service: `POST /notifications/send-email`
   - Notification Service sends approval/rejection email and logs

4. **New Employee Creation**
   - Admin creates employee via form
   - Frontend calls: `POST /api/employees` via Gateway
   - Gateway routes to Employee Service (Port 5219)
   - Employee Service creates employee in database
   - Employee Service calls Notification Service: `POST /notifications/send-email`
   - Notification Service sends welcome email and logs

### Notification Flow

```
Service → API Gateway → Notification Service → MongoDB Log
                ↓
        Email (SMTP) / SMS (Twilio)
                ↓
            Recipient
```

---

## 🔧 Services Documentation

### 1. API Gateway

**Location**: `Services/API.Gateway/`  
**Port**: 8080  
**Technology**: Node.js + Express.js

#### Purpose

The API Gateway acts as a single entry point for all client requests. It handles:
- Request routing to appropriate microservices
- CORS configuration
- Health checks
- Request/response logging

#### Routes

| Path | Routes To | Service |
|------|-----------|---------|
| `/api/auth/*` | Auth Service | Port 5265 |
| `/api/employees/*` | Employee Service | Port 5219 |
| `/api/leave/*` | Leave Service | Port 5555 |
| `/api/leaves/*` | Leave Service | Port 5555 |
| `/notifications/*` | Notification Service | Port 5004 |
| `/api/notifications/*` | Notification Service | Port 5004 |

#### Setup

```bash
cd Services/API.Gateway
npm install
npm start
```

#### Environment Variables

```env
PORT=8080
AUTH_SERVICE_URL=http://localhost:5265
EMPLOYEE_SERVICE_URL=http://localhost:5219
LEAVE_SERVICE_URL=http://localhost:5555
NOTIFICATION_SERVICE_URL=http://localhost:5004
```

#### Health Check

```bash
GET http://localhost:8080/health
```

---

### 2. Auth Service

**Location**: `Services/Auth.API/`  
**Port**: 5265  
**Technology**: .NET Core (C#)  
**Database**: SQL Server

#### Purpose

Handles user authentication, authorization, and JWT token management.

#### Database Schema

**Table: `users_auth`**

| Field | Type | Description |
|-------|------|-------------|
| Id | UUID | Primary Key |
| user_id | UUID | Maps to Employee/Admin |
| Role | enum | 'EMPLOYEE' or 'ADMIN' |
| password_hash | text | Hashed password (bcrypt/argon2) |
| refresh_token | text | Optional refresh token |
| last_login | datetime | Last login timestamp |

#### Endpoints

- `POST /api/auth/login` - Authenticate user, return JWT
- `POST /api/auth/register` - Register new user

#### Integration with Notification Service

When sending OTP during login, call:

```csharp
// Example C# code
var notificationUrl = "http://localhost:8080/notifications/send-sms";
var otpData = new
{
    phone = employee.Phone, // E.164 format: +919876543210
    message = $"Your OTP is {otp}. Valid for 5 minutes."
};

using var client = new HttpClient();
var json = JsonSerializer.Serialize(otpData);
var content = new StringContent(json, Encoding.UTF8, "application/json");
await client.PostAsync(notificationUrl, content);
```

---

### 3. Employee Service

**Location**: `Services/Employee.API/`  
**Port**: 5219  
**Technology**: .NET Core (C#)  
**Database**: SQL Server

#### Purpose

Manages employee master data - creation, updates, retrieval, and deletion.

#### Database Schema

**Table: `employees`**

| Field | Type | Description |
|-------|------|-------------|
| Id | UUID | Primary Key |
| first_name | varchar | First name |
| last_name | varchar | Last name |
| Email | varchar(unique) | Email address (unique) |
| Phone | varchar | Phone number |
| Department | varchar | Department name |
| Designation | varchar | Job title |
| join_date | date | Join date |
| Status | enum | 'ACTIVE' or 'INACTIVE' |
| created_at | datetime | Creation timestamp |
| updated_at | datetime | Last update timestamp |

#### Endpoints

- `GET /api/employees` - Get all employees (Admin only)
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create new employee (Admin only)
- `PUT /api/employees/{id}` - Update employee (Admin only)
- `DELETE /api/employees/{id}` - Delete employee (Admin only)

#### Integration with Notification Service

**Send Welcome Email** when creating a new employee:

```csharp
// After creating employee in database
var notificationUrl = "http://localhost:8080/notifications/send-email";
var emailData = new
{
    to = employee.Email,
    subject = "Welcome to Leave Management System",
    body = $@"
        <h1>Welcome {employee.FirstName} {employee.LastName}!</h1>
        <p>Your account has been successfully created.</p>
        <p>You can now login and start using our system.</p>
    "
};

using var client = new HttpClient();
var json = JsonSerializer.Serialize(emailData);
var content = new StringContent(json, Encoding.UTF8, "application/json");
await client.PostAsync(notificationUrl, content);
```

---

### 4. Leave Service

**Location**: `Services/Leave.API/`  
**Port**: 5555  
**Technology**: Python (Flask)  
**Database**: SQL Server

#### Purpose

Manages leave requests, approvals, and tracking.

#### Database Schema

**Table: `leaves`**

| Field | Type | Description |
|-------|------|-------------|
| Id | UUID | Primary Key |
| employee_id | UUID | Foreign key to employees |
| leave_type | enum | 'ANNUAL', 'SICK', 'CASUAL', 'UNPAID' |
| start_date | date | Leave start date |
| end_date | date | Leave end date |
| reason | text | Leave reason |
| Status | enum | 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED' |
| applied_at | datetime | Application timestamp |
| approved_by | UUID | Admin ID (nullable) |
| approved_at | datetime | Approval timestamp (nullable) |

#### Endpoints

- `POST /api/leave/apply` - Create new leave request
- `GET /api/leave` - Get all leaves (with filters)
- `GET /api/leave?status=PENDING` - Get pending leaves
- `GET /api/leave/{id}` - Get leave details
- `PUT /api/leave/{id}/approve` - Approve leave
- `PUT /api/leave/{id}/reject` - Reject leave

#### Integration with Notification Service

**Send Leave Approval/Rejection Email**:

```python
import requests

# After approving/rejecting leave
notification_url = "http://localhost:8080/notifications/send-email"

# Get employee details
employee = get_employee_by_id(leave.employee_id)
days = (leave.end_date - leave.start_date).days + 1

email_data = {
    "to": employee.email,
    "subject": f"Leave Application {status.upper()}",
    "body": f"""
        <h2>Your Leave Application Has Been {status.upper()}</h2>
        <p><strong>Employee:</strong> {employee.first_name} {employee.last_name}</p>
        <p><strong>Leave Type:</strong> {leave.leave_type}</p>
        <p><strong>Duration:</strong> {days} day(s)</p>
        <p><strong>Status:</strong> {status.upper()}</p>
        <p>Please check your dashboard for more details.</p>
    """
}

response = requests.post(notification_url, json=email_data)
```

---

### 5. Notification Service

**Location**: `Services/Notification.API/`  
**Port**: 5004  
**Technology**: Node.js + Express.js + MongoDB

#### Purpose

Centralized notification service for email and SMS delivery. All notifications are logged to MongoDB for audit purposes.

#### Architecture

```
Notification Service/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic (email, SMS, logging)
│   ├── routes/         # API routes
│   ├── config/         # Database configuration
│   └── models/         # MongoDB schemas
├── app.js              # Entry point
└── package.json
```

#### Database Schema (MongoDB)

**Collection: `notification_logs`**

```javascript
{
  id: UUID,
  type: "EMAIL" | "SMS",
  recipient: String,      // Email or phone number
  message: String,        // Email body or SMS message
  status: "SUCCESS" | "FAILED",
  subject: String,        // Email subject (optional)
  error: String,          // Error message if failed (optional)
  created_at: Date
}
```

#### Endpoints

##### 1. Send Email

**Endpoint**: `POST /notifications/send-email`

**Request Body**:
```json
{
  "to": "user@example.com",
  "subject": "Leave Approved",
  "body": "<h1>Your leave has been approved</h1>"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "message-id"
}
```

**Usage Example** (C#):
```csharp
var client = new HttpClient();
var data = new { to = "user@example.com", subject = "Test", body = "Hello" };
var json = JsonSerializer.Serialize(data);
var content = new StringContent(json, Encoding.UTF8, "application/json");
var response = await client.PostAsync("http://localhost:8080/notifications/send-email", content);
```

**Usage Example** (Python):
```python
import requests

response = requests.post(
    "http://localhost:8080/notifications/send-email",
    json={
        "to": "user@example.com",
        "subject": "Test",
        "body": "Hello"
    }
)
```

##### 2. Send SMS

**Endpoint**: `POST /notifications/send-sms`

**Request Body**:
```json
{
  "phone": "+919876543210",
  "message": "Your OTP is 123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "messageId": "sms-sid"
}
```

**Important**: Phone number must be in E.164 format (e.g., `+919876543210`)

**Usage Example** (C#):
```csharp
var client = new HttpClient();
var data = new { phone = "+919876543210", message = "Your OTP is 123456" };
var json = JsonSerializer.Serialize(data);
var content = new StringContent(json, Encoding.UTF8, "application/json");
var response = await client.PostAsync("http://localhost:8080/notifications/send-sms", content);
```

##### 3. Get Notification Logs

**Endpoint**: `GET /notifications/logs`

**Query Parameters**:
- `type` (optional): Filter by type (`EMAIL` or `SMS`)
- `status` (optional): Filter by status (`SUCCESS` or `FAILED`)
- `limit` (optional): Number of records (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "EMAIL",
      "recipient": "user@example.com",
      "message": "...",
      "status": "SUCCESS",
      "created_at": "2024-12-02T10:30:00Z"
    }
  ],
  "total": 150,
  "limit": 100,
  "offset": 0
}
```

#### Setup

```bash
cd Services/Notification.API
npm install
npm start
```

#### Environment Variables

Create `.env` file in `Services/Notification.API/`:

```env
# Server
PORT=5004

# MongoDB
MONGODB_URI=mongodb://localhost:27017/leave_management

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SMS (Twilio) - Optional
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Gmail Setup

1. Go to Google Account Settings → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Use the 16-character password as `SMTP_PASSWORD`

#### SMS Setup (Optional)

- Service works without Twilio (uses mock SMS for development)
- For production, sign up at https://www.twilio.com
- Add credentials to `.env` file

#### Features

- ✅ Automatic logging of all notifications to MongoDB
- ✅ Error handling with detailed error messages
- ✅ Input validation
- ✅ Mock SMS mode for development
- ✅ HTML email support
- ✅ Health check endpoint: `GET /health`

---

## 💻 Frontend Application

**Location**: `frontend-ui/`  
**Port**: 3000  
**Technology**: React.js + TailwindCSS

### Pages

1. **Login Page** (`/login`)
   - Email and password authentication
   - Role-based redirect (Admin → `/admin/dashboard`, Employee → `/employee/dashboard`)

2. **Admin Dashboard** (`/admin/dashboard`)
   - Total employees count
   - Leave statistics (Pending, Approved, Rejected)
   - Recent leave requests

3. **Employee List** (`/admin/employees`)
   - View all employees
   - Search functionality
   - Edit/Delete actions

4. **Add/Edit Employee** (`/admin/employees/add`, `/admin/employees/edit/:id`)
   - Complete employee form
   - Create or update employee data

5. **Employee Dashboard** (`/employee/dashboard`)
   - Personal leave statistics
   - Recent leave requests

6. **Apply Leave** (`/employee/apply-leave`)
   - Leave application form
   - Leave type, dates, reason

7. **My Leave Requests** (`/employee/my-leaves`)
   - List of employee's leave applications
   - Status tracking

8. **Leave Details** (`/leaves/:id`)
   - Detailed view of leave request
   - Approval details (for admins)

9. **Notification Logs** (`/admin/notification-logs`)
   - View all notification history
   - Filter by type and status

### Setup

```bash
cd frontend-ui
npm install
npm start
```

### Environment Variables

Create `.env` file in `frontend-ui/`:

```env
REACT_APP_API_URL=http://localhost:8080
```

### Authentication

- JWT token stored in `localStorage`
- Axios interceptor automatically adds token to requests
- Private routes redirect to login if unauthorized
- Role-based access control

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (for Notification Service)
- SQL Server (for Auth, Employee, Leave services)
- .NET SDK (for Auth and Employee services)
- Python 3.8+ (for Leave service)

### Step-by-Step Setup

#### 1. Clone Repository

```bash
git clone <repository-url>
cd LeaveManagement
```

#### 2. Start MongoDB

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

#### 3. Setup Notification Service

```bash
cd Services/Notification.API
npm install

# Create .env file with MongoDB URI and SMTP credentials
npm start
```

#### 4. Setup API Gateway

```bash
cd Services/API.Gateway
npm install
npm start
```

#### 5. Setup Frontend

```bash
cd frontend-ui
npm install

# Create .env file with API Gateway URL
npm start
```

#### 6. Start Other Services

Start Auth, Employee, and Leave services according to their respective documentation.

---

## 👨‍💻 Developer Integration Guide

### For Service Developers

When developing or integrating with other services, follow these guidelines:

#### 1. Calling Notification Service

Always call Notification Service through the API Gateway:

```javascript
// ✅ Correct
const gatewayUrl = "http://localhost:8080/notifications/send-email";

// ❌ Wrong - Don't call directly
const directUrl = "http://localhost:5004/notifications/send-email";
```

#### 2. Error Handling

Notification failures should not break your main workflow:

```csharp
// C# Example
try
{
    await SendNotification();
}
catch (Exception ex)
{
    _logger.LogWarning(ex, "Notification failed, but operation continues");
    // Continue with main operation
}
```

#### 3. Async Calls

Send notifications asynchronously to avoid blocking:

```python
# Python Example
import asyncio

async def approve_leave(leave_id):
    # Update leave in database
    update_leave_status(leave_id, "APPROVED")
    
    # Send notification asynchronously (don't await)
    asyncio.create_task(send_approval_notification(leave_id))
```

#### 4. Notification Templates

Use consistent email templates:

**Welcome Email**:
```
Subject: Welcome to Leave Management System
Body: HTML with employee name, login instructions
```

**Leave Approval**:
```
Subject: Leave Application APPROVED/REJECTED
Body: HTML with leave details, dates, status
```

**OTP SMS**:
```
Message: "Your OTP is {code}. Valid for 5 minutes. Do not share."
```

#### 5. Testing

Test notifications using the developer page:
- Navigate to: `http://localhost:3000/developer/notifications`
- Use test forms to send emails and SMS

---

## 📚 API Documentation

### Base URLs

- **API Gateway**: `http://localhost:8080`
- **Auth Service**: `http://localhost:5265`
- **Employee Service**: `http://localhost:5219`
- **Leave Service**: `http://localhost:5555`
- **Notification Service**: `http://localhost:5004`

### Common Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <jwt-token>
```

---

## 🔍 Troubleshooting

### Notification Service Issues

**Email not sending**:
- Check SMTP credentials in `.env`
- Verify Gmail App Password is correct
- Check firewall/network restrictions

**SMS not sending**:
- Service uses mock SMS if Twilio not configured
- Verify phone number format (E.164: `+919876543210`)
- Check Twilio credentials

**MongoDB connection failed**:
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB port (default: 27017)

### API Gateway Issues

**Service not reachable**:
- Check if service is running
- Verify service URL in Gateway `.env`
- Check service health endpoint

### Frontend Issues

**API calls failing**:
- Verify API Gateway is running
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

---

## 📝 Additional Resources

- **API Gateway Health**: `http://localhost:8080/health`
- **Notification Service Health**: `http://localhost:5004/health`
- **Frontend Developer Tools**: `http://localhost:3000/developer/notifications`

---

## 🤝 Contributing

When adding new features or services:

1. Update this README with service documentation
2. Add integration examples for Notification Service
3. Update API Gateway routes if needed
4. Add environment variables to `.env.example` files

---

## 📄 License

MIT License

---

## 👥 Support

For questions or issues:
1. Check service health endpoints
2. Review logs in console
3. Verify environment variables
4. Test notifications via developer page

---

**Last Updated**: December 2024

