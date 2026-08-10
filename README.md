# Multi-Tenant SaaS Expense Tracker

A secure, scalable, and responsive **Multi-Tenant SaaS Expense Tracker** designed to allow multiple organizations to manage company expenses, approvals, reimbursements, reports, and audit history while maintaining strict tenant-level data isolation.

---

## 📌 Project Overview

The **Multi-Tenant SaaS Expense Tracker** is a Software-as-a-Service application that allows multiple organizations, called **tenants**, to use the same application while keeping their data isolated.

### Example Tenants

```text
Company A
Company B
Company C
```

Each organization can manage its own:

* Users
* Expenses
* Approvals
* Reimbursements
* Reports
* Audit history

The most important security requirement is:

```text
Company A → Company A data only
Company B → Company B data only
Company C → Company C data only
```

A user from one tenant must never be able to access another tenant's data.

### Important Security Principle

Tenant isolation is **not enforced by the frontend**.

The backend is responsible for:

1. Identifying the authenticated user.
2. Determining the user's tenant.
3. Validating access.
4. Filtering database queries by the authenticated tenant.
5. Rejecting cross-tenant access attempts.

The frontend only consumes the secure APIs provided by the backend.

---

# 🎯 Problem Statement

Traditional expense management systems can become difficult to maintain when multiple organizations need to use the same application.

A multi-tenant expense management platform must provide:

* Secure tenant isolation
* User and role management
* Expense creation and tracking
* Manager approval workflows
* Finance reimbursement tracking
* Reports and summaries
* Complete audit history
* Responsive user interface
* Scalable architecture

The system must ensure that one organization cannot access another organization's expenses, users, reports, or audit records.

---

# 🎯 Project Objectives

The main objectives of this project are:

1. Build a multi-tenant SaaS expense management platform.
2. Allow multiple organizations to use the same application.
3. Maintain strict tenant-level data isolation.
4. Provide role-based application workflows.
5. Allow employees to create and manage expenses.
6. Allow managers to approve or reject expenses.
7. Allow finance users to manage reimbursements.
8. Provide expense reports and summaries.
9. Maintain a complete audit trail.
10. Provide testing for authentication, authorization, tenant isolation, and integration.
11. Build a clean and responsive SaaS-style frontend.
12. Design a database structure that can support future tenant scaling.

---

# 🏗️ System Architecture

The overall system follows this architecture:

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │   Business Logic     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Authentication / JWT │
                    │ Tenant Identification│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Prisma ORM Layer   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │       Database       │
                    └──────────────────────┘
```

### Tenant Isolation Flow

```text
User Login
    ↓
Authentication
    ↓
Authenticated User
    ↓
Determine tenantId
    ↓
Backend validates tenant access
    ↓
Prisma query
    ↓
PostgreSQL
    ↓
Only authenticated tenant's data
```

---

# 🧑‍💻 Team Responsibilities

The project is divided among four team members.

## Team Member 1 / Backend Developer

Responsible for:

* Node.js
* Express.js
* REST APIs
* JWT authentication
* Business logic
* API integration
* Backend authorization
* Tenant identification
* Connecting backend with Prisma/PostgreSQL

---

## Team Member 2 / Database Developer

Responsible for:

* PostgreSQL
* Prisma ORM
* Database schema
* Database relationships
* Foreign keys
* Constraints
* Indexes
* Tenant data isolation at database/query level
* Database migrations
* Seed/test data
* Database integration support

---

## Team Member 3 / Audit, Testing & Documentation

Responsible for:

* Audit History functionality
* Application testing
* Tenant isolation testing
* API testing
* Integration testing
* Bug tracking
* Documentation
* Testing reports
* PPT evidence
* Audit History UI support

---

## Team Member 4 / Frontend Developer

Responsible for:

* React frontend
* React Router
* Axios API communication
* Login/Register UI
* Dashboard
* Expense management UI
* Manager approval UI
* Finance UI
* Reports UI
* Audit History UI
* Role-based navigation
* Responsive design
* Frontend loading/error/empty states

---

# 🛠️ Technologies

## Frontend

* React
* JavaScript
* React Router
* Axios
* CSS / Tailwind CSS

## Backend

* Node.js
* Express.js
* JWT
* REST APIs

## Database

* PostgreSQL
* Prisma ORM

## Development & Testing

* Git
* GitHub
* VS Code
* Postman
* Prisma Studio

## Future / Deployment Technologies

The project architecture is designed to support:

* Docker
* Kubernetes
* Prometheus

These are not part of the initial database implementation.

---

# 👥 User Roles

The application supports four roles:

```text
ADMIN
EMPLOYEE
MANAGER
FINANCE
```

## Employee

Employees can:

* View dashboard
* Add expenses
* View their expenses
* View expense details

Navigation:

```text
Dashboard
Add Expense
My Expenses
Expense Details
```

---

## Manager

Managers can:

* View dashboard
* View expenses
* View pending approvals
* Approve expenses
* Reject expenses
* View audit history

Navigation:

```text
Dashboard
Expenses
Pending Approvals
Audit History
```

---

## Finance

Finance users can:

* View dashboard
* View approved expenses
* Manage reimbursements
* View reports

Navigation:

```text
Dashboard
Approved Expenses
Reimbursements
Reports
```

---

## Admin

Administrators can:

* View dashboard
* Manage users
* View expenses
* View reports
* View audit history

Navigation:

```text
Dashboard
Users
Expenses
Reports
Audit History
```

---

# 🏢 Multi-Tenant Architecture

The application supports multiple organizations.

Example:

```text
Tenant A
├── Users
├── Expenses
└── Audit Events

Tenant B
├── Users
├── Expenses
└── Audit Events

Tenant C
├── Users
├── Expenses
└── Audit Events
```

For the first implementation, the project uses:

```text
Shared PostgreSQL Database
        ↓
Shared Tables
        ↓
tenantId-based isolation
```

Example:

```text
expenses

id | tenantId | amount | category
-----------------------------------
1  | tenant-A | 5000   | TRAVEL
2  | tenant-B | 3000   | FOOD
3  | tenant-A | 2000   | OFFICE
```

A tenant-specific query conceptually follows:

```text
WHERE tenantId = authenticatedTenantId
```

The backend obtains the authenticated tenant ID.

The frontend must never allow users to manually select another tenant.

---

# 🔐 Tenant Isolation

Tenant isolation is one of the most important requirements of the project.

### Required behavior

```text
Tenant A → A data       ✅
Tenant B → B data       ✅
Tenant C → C data       ✅

Tenant A → B data       ❌
Tenant B → A data       ❌
Tenant C → A data       ❌
```

The frontend must not implement tenant security as its primary mechanism.

The backend must:

1. Authenticate the user.
2. Determine the user's tenant.
3. Validate the requested resource.
4. Apply tenant filtering.
5. Reject unauthorized cross-tenant requests.

---

# 🗄️ Database Design

The primary database entities are:

```text
Tenant
   │
   ├── Users
   │
   ├── Expenses
   │
   └── AuditEvents

User
   │
   └── Expenses

Expense
   │
   └── AuditEvents
```

---

## Tenant

Important fields:

```text
id
name
plan
isolationType
createdAt
updatedAt
```

Plans:

```text
STANDARD
ENTERPRISE
```

Isolation types:

```text
SHARED
PRIVATE_SCHEMA
```

---

## User

Important fields:

```text
id
tenantId
name
email
passwordHash
role
createdAt
updatedAt
```

Roles:

```text
ADMIN
EMPLOYEE
MANAGER
FINANCE
```

Each user belongs to exactly one tenant.

---

## Expense

Important fields:

```text
id
tenantId
userId
amount
category
description
date
status
createdAt
updatedAt
```

### Expense Status

```text
PENDING
APPROVED
REJECTED
REIMBURSED
```

### Expense Categories

```text
TRAVEL
FOOD
OFFICE
INFRASTRUCTURE
SALARY
EQUIPMENT
OTHER
```

---

## AuditEvent

Important fields:

```text
id
tenantId
expenseId
userId
action
details
timestamp
```

### Audit Actions

```text
CREATED
UPDATED
APPROVED
REJECTED
DELETED
```

---

# 💰 Expense Management

The application supports:

* Add Expense
* View Expense List
* View Expense Details
* Edit Expense
* Delete Expense

Expense information includes:

```text
Amount
Category
Description
Date
Status
```

---

# 👨‍💼 Manager Approval

Managers can:

1. View pending expenses.
2. Open expense details.
3. Approve expenses.
4. Reject expenses.
5. Provide a rejection reason when required.

Approval flow:

```text
Employee
   ↓
Create Expense
   ↓
PENDING
   ↓
Manager Reviews
   ↓
 ┌───────────────┐
 │               │
 ▼               ▼
APPROVED       REJECTED
```

---

# 💳 Finance & Reimbursement

Finance users can:

* View approved expenses.
* View reimbursement/payment status.
* Update reimbursement status when supported by the backend API.

Possible final expense status:

```text
REIMBURSED
```

---

# 📊 Dashboard

The dashboard provides information such as:

* Total expenses
* Pending expenses
* Approved expenses
* Rejected expenses
* Total amount spent
* Recent expenses
* Expense category summary

The dashboard data is obtained from backend APIs.

---

# 📈 Reports

The reports module can display:

* Total expenses
* Expenses by category
* Expenses by date
* Approved expenses
* Pending expenses
* Rejected expenses
* Total spending

Simple charts may be used when they improve readability.

---

# 📝 Audit History

The system maintains a traceable history of important expense operations.

Recorded actions include:

```text
CREATED
UPDATED
APPROVED
REJECTED
DELETED
```

Example:

```text
Tenant A
   ↓
Employee creates ₹5000 expense
   ↓
Expense saved
   ↓
Audit Event Created
   ↓
Action: CREATED
User: Employee A
Expense: #101
Time: 10:30 AM
```

The Audit History UI displays:

```text
Date | User | Action | Expense | Details
```

Tenant isolation must also apply to audit records.

---

# 🔌 REST API Structure

The frontend communicates with the backend through REST APIs.

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

---

## Expenses

```http
POST   /api/expenses
GET    /api/expenses
GET    /api/expenses/:id
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

---

## Approval

```http
POST /api/expenses/:id/approve
POST /api/expenses/:id/reject
```

---

## Reports

```http
GET /api/reports/summary
```

---

## Audit

```http
GET /api/audit
```

API contracts should not be changed without discussion between the team members.

---

# 🔑 Authentication Flow

The authentication flow is:

```text
User
 ↓
Login Page
 ↓
POST /api/auth/login
 ↓
Backend validates credentials
 ↓
JWT/token returned
 ↓
Frontend stores authentication token
 ↓
Axios sends token with requests
 ↓
Backend authenticates request
 ↓
Backend identifies tenant
 ↓
Backend returns authorized data
```

Unauthenticated users should be redirected to the Login page.

---

# 🖥️ Frontend Structure

The frontend follows a modular React structure:

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── services/
    ├── context/
    ├── hooks/
    ├── routes/
    ├── utils/
    ├── assets/
    ├── App.jsx
    └── main.jsx
```

The structure can be adjusted when required, but unnecessary files should be avoided.

---

# 📁 Complete Project Folder Structure

The overall repository is organized as:

```text
multi-tenant-expense-tracker/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── database/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   └── DATABASE.md
│
├── docs/
│   ├── testing.md
│   ├── audit-history.md
│   └── integration-testing.md
│
├── docker-compose.yml
│
└── README.md
```

---

# 🧪 Testing Strategy

Testing is performed at multiple levels.

## Authentication Testing

Test:

* Valid login
* Invalid login
* Logout
* Unauthorized access
* Invalid token
* Expired token

---

## Expense Testing

Test:

* Create expense
* View expense
* Update expense
* Delete expense
* Invalid expense data
* Negative amount
* Missing required fields
* Non-existent expense ID

---

## Approval Testing

Test:

* Manager approves expense
* Manager rejects expense
* Employee cannot perform manager-only actions
* Invalid approval request

---

# 🔒 Tenant Isolation Testing

Tenant isolation is a critical test area.

### Test Environment

```text
Tenant A
├── User A
└── Expense A1

Tenant B
├── User B
└── Expense B1
```

### Test 1

```text
Login as User A
        ↓
Request expenses
        ↓
Expected: Expense A1 only
```

### Test 2

```text
Login as User B
        ↓
Request expenses
        ↓
Expected: Expense B1 only
```

### Test 3

```text
User A
   ↓
Request Expense B1
   ↓
Expected: ACCESS DENIED / NOT FOUND
```

### Test 4

```text
User A
   ↓
Attempt to modify Expense B1
   ↓
Expected: Operation rejected
```

### Test 5

```text
User A
   ↓
Attempt to delete Expense B1
   ↓
Expected: Operation rejected
```

### Test 6

```text
User A
   ↓
Request Tenant B audit events
   ↓
Expected: Access denied
```

No fake test results should be added to the documentation.

Only actual test results should be recorded.

---

# 🔄 End-to-End Integration Flow

The complete application flow is:

```text
REGISTER
   ↓
LOGIN
   ↓
DASHBOARD
   ↓
ADD EXPENSE
   ↓
DATABASE
   ↓
MANAGER APPROVAL
   ↓
AUDIT EVENT
   ↓
REPORT
```

Technical integration:

```text
React Frontend
      ↓
Axios
      ↓
Express REST API
      ↓
JWT Authentication
      ↓
Tenant Identification
      ↓
Prisma
      ↓
PostgreSQL
```

---

# 🧪 API Testing

API testing can be performed using Postman.

Important endpoints:

```http
POST /api/auth/register
POST /api/auth/login

POST /api/expenses
GET /api/expenses
GET /api/expenses/:id
PUT /api/expenses/:id
DELETE /api/expenses/:id

POST /api/expenses/:id/approve
POST /api/expenses/:id/reject

GET /api/reports/summary
GET /api/audit
```

For each endpoint, test:

* Valid request
* Invalid request
* Unauthorized request
* Wrong-tenant request where applicable
* Expected status code
* Response body

---

# 📱 Responsive Design

The frontend should support:

```text
Desktop
Tablet
Mobile
```

The UI should include:

* Sidebar navigation
* Top navigation/header
* Dashboard cards
* Tables
* Forms
* Status badges
* Loading states
* Error messages
* Empty states
* Confirmation dialogs

The interface should remain professional and simple without unnecessary animations.

---

# 🌱 Git Workflow

The project uses Git and GitHub for collaborative development.

The main branches are:

```text
main
develop
```

### Branch Purpose

`main`

```text
Stable / final version
```

`develop`

```text
Integration branch for team development
```

Feature branches are created from `develop`.

---

# 🌿 Branch Naming Convention

Recommended branches:

```text
feature/frontend
feature/backend
feature/database
feature/testing
```

Additional branches can use:

```text
feature/login
feature/expense-management
feature/audit-history
feature/reports
fix/login-error
fix/tenant-isolation
docs/testing
```

---

# 🔄 Team Git Workflow

The normal workflow is:

```text
develop
   ↓
Create feature branch
   ↓
Write code
   ↓
Test locally
   ↓
git add
   ↓
git commit
   ↓
git push
   ↓
Create Pull Request
   ↓
Team review
   ↓
Merge into develop
```

Do not directly push experimental or unfinished work to `main`.

---

# 💻 Git Commands

## Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd multi-tenant-expense-tracker
```

---

## Check Current Branch

```bash
git branch
```

---

## Get Latest Changes

```bash
git pull origin develop
```

---

## Create a Feature Branch

Example:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/frontend
```

---

## Check Changes

```bash
git status
```

---

## Add Changes

```bash
git add .
```

---

## Commit Changes

```bash
git commit -m "Add frontend project setup"
```

---

## Push Branch

```bash
git push -u origin feature/frontend
```

Then create a Pull Request on GitHub.

---

# ⚠️ Git Safety Rules

Before starting work:

```bash
git checkout develop
git pull origin develop
```

Create or switch to your feature branch.

Before committing:

```bash
git status
```

Review your changes carefully.

Do not commit:

```text
.env
node_modules/
passwords
API secrets
database credentials
private keys
```

Use `.gitignore` to prevent sensitive or unnecessary files from being committed.

---

# 🏃 How to Run the Project

The exact commands may change depending on the final implementation.

## Frontend

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

## Backend

Navigate to:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend using the command defined in its `package.json`.

For example:

```bash
npm run dev
```

---

## Database

The database uses PostgreSQL and Prisma.

After PostgreSQL is configured, the database developer can run:

```bash
npx prisma generate
```

Apply development migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

Seed data will be added using the project's configured Prisma seed command.

---

# 🔐 Environment Variables

Environment variables should be stored in `.env` files locally and should not be committed to GitHub.

Example frontend configuration:

```text
VITE_API_BASE_URL=http://localhost:5000
```

Example backend/database configuration:

```text
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret
```

These values are examples only.

Never commit real secrets to GitHub.

---

# 🧩 Development Order

The project will be developed in the following order.

### Frontend

```text
1. Project setup and folder structure
2. Login/Register UI
3. Routing and protected routes
4. Dashboard
5. Expense management
6. Manager approval
7. Finance/reimbursement
8. Audit history
9. Reports
10. API integration
11. Loading/error/empty states
12. Responsive design
13. Final testing
```

### Database

```text
1. Inspect repository
2. Database design
3. Prisma schema
4. Migration
5. PostgreSQL connection
6. Seed data
7. Relationship testing
8. Tenant isolation testing
9. DATABASE.md
10. Backend integration instructions
```

### Testing & Documentation

```text
1. Inspect repository
2. Audit functionality
3. Audit History UI
4. Authentication testing
5. Expense testing
6. Approval testing
7. Tenant isolation testing
8. API testing
9. Integration testing
10. Bug tracking
11. Documentation
12. PPT evidence
```

---

# 📚 Documentation

Project documentation is maintained inside:

```text
docs/
```

Important documents include:

```text
docs/
├── testing.md
├── audit-history.md
└── integration-testing.md
```

Database documentation:

```text
database/
└── DATABASE.md
```

---

# 🧾 Testing Documentation

`testing.md` should contain:

* Test environment
* Test cases
* Test steps
* Expected results
* Actual results
* PASS / FAIL status
* Bugs found
* Bugs fixed

Example:

```text
Test ID: TC-001

Test:
Tenant A views expenses

Steps:
1. Login as Tenant A user.
2. Open expense list.
3. Request expenses.

Expected:
Only Tenant A expenses are returned.

Actual:
[Record actual result after testing]

Status:
PASS / FAIL
```

---

# 📝 Audit Documentation

`audit-history.md` explains:

* What actions are recorded
* Why audit history is required
* Audit event structure
* Audit flow
* Tenant isolation of audit events
* Example audit records

---

# 🔗 Integration Documentation

`integration-testing.md` explains:

```text
Frontend
   ↓
Backend API
   ↓
Authentication
   ↓
Tenant validation
   ↓
Database
   ↓
Response
   ↓
Frontend
```

It should also document:

* Authentication integration
* Expense workflow
* Manager approval
* Audit events
* Tenant isolation
* Reports
* Common integration failures

---

# 🐛 Error Handling

The application should handle common failures gracefully.

Examples:

```text
Backend unavailable
Database unavailable
Invalid token
Expired token
Invalid expense
Missing required fields
Unauthorized role
Wrong tenant
Non-existent expense
```

The frontend should show meaningful error messages instead of crashing.

The testing team should reproduce and document failures before fixes are applied.

---

# 🚫 Project Rules

## Do Not

* Change another team member's module without discussion.
* Change API contracts without informing the backend developer.
* Introduce MongoDB.
* Introduce unnecessary technologies.
* Create unnecessary files.
* Commit secrets.
* Hard-code tenant IDs.
* Allow frontend tenant selection.
* Trust frontend tenant isolation as a security mechanism.
* Create fake testing results.
* Silently modify another person's work.

---

# 🏢 Future Enterprise Tenant Isolation

The first implementation uses:

```text
Shared Database
+
Shared Tables
+
tenantId isolation
```

The project can later support enterprise tenants using:

```text
Public / Shared Schema
        +
Private PostgreSQL Schema
```

For example:

```text
public
├── shared application data

tenant_enterprise_a
├── tenant-specific data
```

This should be introduced only when required.

The project will not automatically create hundreds of schemas.

A practical migration strategy can be designed later for enterprise tenants.

---

# 📋 Final Deliverables

At the end of development, the project should provide:

## Frontend

* Login/Register
* Protected routes
* Dashboard
* Expense management
* Manager approval
* Finance/reimbursement
* Audit History
* Reports
* Role-based navigation
* Responsive UI
* API integration
* Error/loading/empty states

## Database

* PostgreSQL database
* Prisma schema
* Migrations
* Relationships
* Constraints
* Indexes
* Seed data
* Tenant isolation support
* Database documentation

## Backend

* Express REST APIs
* Authentication
* JWT
* Tenant identification
* Business logic
* Authorization
* Database integration

## Testing & Documentation

* Audit History
* Test checklist
* API testing
* Tenant isolation testing
* Integration testing
* Bug/fix report
* Documentation
* PPT evidence

---

# ✅ Final Testing Checklist

```text
[ ] Registration works
[ ] Login works
[ ] Invalid login is rejected
[ ] Logout works
[ ] Protected routes work
[ ] Employee can create expense
[ ] Employee can view expenses
[ ] Employee can edit expense
[ ] Employee can delete expense
[ ] Manager can view pending expenses
[ ] Manager can approve expense
[ ] Manager can reject expense
[ ] Finance can view approved expenses
[ ] Reimbursement workflow works
[ ] Reports display correct data
[ ] Audit events are generated
[ ] Audit history is displayed
[ ] Tenant A sees only Tenant A data
[ ] Tenant B sees only Tenant B data
[ ] Cross-tenant expense access is rejected
[ ] Cross-tenant audit access is rejected
[ ] Unauthorized requests are rejected
[ ] Invalid tokens are handled
[ ] Expired tokens are handled
[ ] Backend failure is handled
[ ] Database failure is handled
[ ] Mobile UI works
[ ] Tablet UI works
[ ] Desktop UI works
[ ] Production build succeeds
```

---

# 📸 Hackathon PPT Evidence

The team should collect real screenshots showing:

1. Tenant isolation test
2. Audit History
3. Expense workflow
4. API testing in Postman
5. Dashboard
6. Manager approval
7. Database/Prisma structure
8. Test result summary

Only actual test results should be presented.

---

# 🚀 Production Build

For the React frontend:

```bash
npm run build
```

The generated production files will normally be placed in:

```text
dist/
```

The exact deployment process depends on the final hosting environment.

---

# 🤝 Team Collaboration

Each team member should work only on their assigned responsibility.

Before modifying another module:

```text
Identify the issue
      ↓
Discuss with responsible member
      ↓
Agree on the change
      ↓
Implement
      ↓
Test
      ↓
Document
```

This prevents conflicts and accidental overwriting of another member's work.

---

# 📌 Project Summary

The **Multi-Tenant SaaS Expense Tracker** provides a complete expense management platform for multiple organizations.

The core architecture is:

```text
                    MULTI-TENANT SaaS
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Tenant A         Tenant B         Tenant C
          │                │                │
       Users            Users            Users
       Expenses         Expenses         Expenses
       Audits           Audits           Audits
          │                │                │
          └────────────────┼────────────────┘
                           │
                    Secure REST API
                           │
                       PostgreSQL
```

The central security principle is:

> **A tenant can access only its own data.**

The backend enforces tenant isolation, the database maintains the required relationships and constraints, the frontend consumes secure APIs, and the testing team verifies that the complete system behaves correctly.

---

# 👨‍💻 Development Status

```text
Project Setup              ⬜
Frontend                    ⬜
Backend                     ⬜
Database                    ⬜
Authentication              ⬜
Expense Management          ⬜
Manager Approval            ⬜
Finance                     ⬜
Audit History               ⬜
Reports                     ⬜
Tenant Isolation            ⬜
Integration Testing         ⬜
Documentation               ⬜
Final Testing               ⬜
Production Build            ⬜
```

Update this section as development progresses.

---

# 📄 License

This project is developed as an academic/hackathon project.

License details can be added based on the team's final requirements.


## Team Members

| Member | Role | Responsibilities |
|---|---|---|
| Archana | Frontend Developer | React, UI, API integration |
| Dharani | Backend Developer | Node.js, Express, JWT, APIs |
| Sarulatha | Database Developer | PostgreSQL, Prisma, tenant isolation |
| Haripriya | Testing & Documentation | Audit, testing, documentation |
