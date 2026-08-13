# Multi-Tenant SaaS Expense Tracker

A secure, scalable, and multi-tenant SaaS platform for managing organizational expenses, approvals, reimbursements, reports, and audit history.

The system is designed for multiple organizations (tenants) to use the same application while ensuring that each tenant can access only its own data.

---

## 1. Project Overview

The **Multi-Tenant SaaS Expense Tracker** is a cloud-ready web application that helps organizations manage their complete expense lifecycle.

Employees can submit expenses, managers can review and approve or reject them, finance users can process reimbursements, and administrators can manage users and monitor organizational activities.

The application follows a multi-tenant architecture where tenant identification and authorization are enforced on the backend.

### Main Goals

- Secure multi-tenant data isolation
- Employee expense submission
- Manager approval workflow
- Finance reimbursement processing
- Administrative user management
- Expense reporting and analytics
- Complete audit history
- Role-based access control
- Scalable cloud-ready architecture
- Monitoring and observability

---

# 2. Problem Statement

Traditional expense management systems may have difficulty handling multiple organizations securely within the same application.

A SaaS expense platform must ensure that:

- One organization cannot access another organization's data.
- Users can perform only the actions permitted by their roles.
- Expense changes are recorded for auditing.
- The system can support organizations of different sizes.
- The application can scale as the number of users and expenses increases.

This project addresses these requirements using a secure multi-tenant architecture.

---

# 3. Proposed Solution

The system uses a centralized SaaS application where multiple organizations share the application infrastructure while their data remains logically isolated.

Every authenticated request contains tenant information obtained from the authenticated user's security context.

The backend validates:

1. User authentication
2. User role
3. Tenant identity
4. Requested resource
5. Authorization rules

Only after these checks does the request reach the business logic.

---

# 4. Technology Stack

## Frontend

- React.js
- Vite
- JavaScript
- Axios
- React Router
- CSS
- Lucide React

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- JWT Authentication
- Hibernate / JPA
- Bean Validation

## Database

- PostgreSQL
- Hibernate ORM
- HikariCP Connection Pool

## Messaging and Audit

- Apache Kafka
- Kafka Producer
- Kafka Consumer
- Audit Event Processing

## Deployment

- Docker
- Docker Compose
- Kubernetes

## Monitoring

- Prometheus
- Spring Boot Actuator

---

# 5. System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         │ Employee / Manager  │
                         │ Finance / Admin     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │       Vite          │
                         └──────────┬──────────┘
                                    │
                              REST / HTTPS
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Spring Boot API   │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
              ┌────────────┐ ┌────────────┐ ┌─────────────┐
              │  Spring    │ │   Tenant   │ │    Role     │
              │  Security  │ │ Validation │ │ Authorization│
              └────────────┘ └────────────┘ └─────────────┘
                     │              │              │
                     └──────────────┼──────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Service Layer       │
                         │ Business Logic      │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │                             │
                     ▼                             ▼
          ┌─────────────────────┐        ┌─────────────────┐
          │ PostgreSQL          │        │ Apache Kafka    │
          │ Tenant Data         │        │ Audit Events    │
          │ Expenses            │        └────────┬────────┘
          │ Users               │                 │
          │ Audit Records       │                 ▼
          └─────────────────────┘        ┌─────────────────┐
                                         │ Audit Consumer  │
                                         │ Audit Storage   │
                                         └─────────────────┘

                         ┌─────────────────────┐
                         │ Prometheus          │
                         │ Monitoring Metrics  │
                         └─────────────────────┘



🔐 Multi-Tenant Architecture

The application is designed for multiple organizations.

Each request contains authenticated user information, including the tenant identity.

User Request
     │
     ▼
JWT Authentication
     │
     ▼
Extract Tenant ID
     │
     ▼
Identify Tenant Context
     │
     ▼
Hibernate Multi-Tenancy
     │
     ▼
Access Only Tenant Data

For example:

Tenant A
 ├── Users
 ├── Expenses
 ├── Approvals
 └── Audit History

Tenant B
 ├── Users
 ├── Expenses
 ├── Approvals
 └── Audit History

Tenant A must never be able to access Tenant B's information.

🔑 Authentication Flow

The application uses Spring Security + JWT for authentication.

User
 │
 ▼
Login
 │
 ▼
Spring Security
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Return JWT to React
 │
 ▼
React stores authentication token
 │
 ▼
JWT sent with subsequent requests
 │
 ▼
Backend validates JWT
 │
 ▼
Identify User + Tenant + Role

JWT contains information such as:

User ID
Tenant ID
Role
Expiration
👥 Role-Based Access Control

The system provides different permissions for different roles.

Employee

Employees can:

Login
Submit expenses
View their own expenses
Edit eligible expenses
View expense status
View their expense history
Manager

Managers can:

View tenant expenses
Review submitted expenses
Approve expenses
Reject expenses
View reports
View audit history
Finance

Finance users can:

View approved expenses
Process reimbursements
Update reimbursement status
View financial information
View reports
View audit history
Admin

Administrators can:

Manage tenant users
View tenant expenses
Manage organizational data
View reports
View audit history
Perform administrative operations
💰 Expense Management Flow
Employee
   │
   ▼
Create Expense
   │
   ▼
Expense Status = PENDING
   │
   ▼
Manager Reviews
   │
   ├───────────────┐
   │               │
   ▼               ▼
 APPROVED        REJECTED
   │
   ▼
Finance
   │
   ▼
Reimbursement
   │
   ▼
REIMBURSED
🧾 Expense Lifecycle
PENDING
   │
   ├──────────────► REJECTED
   │
   ▼
APPROVED
   │
   ▼
REIMBURSED

Every important state transition generates an audit event.

📝 Audit & Event Processing

Auditability is an important part of the system.

When an important operation occurs:

Expense Operation
       │
       ▼
Generate Audit Event
       │
       ▼
Apache Kafka
       │
       ▼
Kafka Consumer
       │
       ▼
Audit Processing
       │
       ▼
Audit History

Examples of audit events:

EXPENSE_CREATED
EXPENSE_UPDATED
EXPENSE_APPROVED
EXPENSE_REJECTED
EXPENSE_REIMBURSED
USER_CREATED

This provides traceability for important business operations.

📨 Apache Kafka

Apache Kafka is used for asynchronous event processing.

Instead of performing every operation synchronously, the application can publish business events to Kafka.

Example:

Expense Approved
      │
      ▼
Kafka Producer
      │
      ▼
Expense Topic
      │
      ▼
Kafka Consumer
      │
      ▼
Audit Processing

This helps reduce coupling between the main expense-processing workflow and audit/event processing.

🗄️ Database

The application uses:

PostgreSQL

with:

Hibernate / JPA

for persistence.

Core entities include:

Tenant
User
Expense
AuditEvent

Relationship:

Tenant
 │
 ├── Users
 │
 ├── Expenses
 │
 └── Audit Events

Every tenant's data is associated with its tenant identity.

🔒 Tenant Isolation

Tenant isolation is one of the most important security requirements.

Example:

Request from Tenant A

JWT
 │
 └── tenantId = TENANT_A
          │
          ▼
   Tenant Context
          │
          ▼
 Hibernate
          │
          ▼
 Tenant A Data Only

A request from Tenant A cannot access:

Tenant B Users
Tenant B Expenses
Tenant B Reports
Tenant B Audit History

This prevents cross-tenant data leakage.

⚡ HikariCP

The backend uses HikariCP for database connection pooling.

Spring Boot
     │
     ▼
 HikariCP
     │
 ┌───┼───┐
 ▼   ▼   ▼
DB Connections
     │
     ▼
 PostgreSQL

Connection pooling improves database performance by reusing database connections instead of creating a new connection for every request.

📊 Reporting

The dashboard and reporting modules provide information such as:

Total expenses
Pending expenses
Approved expenses
Rejected expenses
Total spending
Category-wise spending
Recent expenses
Expense trends

Example:

                 Dashboard
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   Expenses       Approvals     Reports
       │             │             │
       └─────────────┼─────────────┘
                     ▼
                PostgreSQL
🖥️ Frontend

The frontend is developed using React.js.

Main pages include:

Login
Register
Dashboard
Expenses
Manager Approvals
Finance Reimbursements
Reports
Audit History
Admin Users

The frontend communicates with the Spring Boot backend through REST APIs.

React
  │
  ▼
Axios / REST API
  │
  ▼
Spring Boot

No business-critical data should be maintained as hardcoded frontend mock data in the production application.

🔌 REST API Flow

Example login request:

POST /api/auth/login

Expense APIs:

GET    /api/expenses
POST   /api/expenses
GET    /api/expenses/{id}
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}

Approval APIs:

POST /api/expenses/{id}/approve
POST /api/expenses/{id}/reject

Reimbursement:

POST /api/expenses/{id}/reimburse

Reports:

GET /api/reports/summary

Audit:

GET /api/audit

User management:

GET /api/users
🐳 Docker

Each application component can be containerized.

                 Docker
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   Frontend     Backend     PostgreSQL
    React      Spring Boot

Docker provides consistent application environments across development, testing, and deployment.

☸️ Kubernetes

Kubernetes is used for container orchestration.

                Kubernetes Cluster
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
 Frontend Pod     Backend Pods     Kafka Pods
       │               │
       │               ▼
       │          PostgreSQL
       │
       ▼
    Service

Kubernetes enables:

Container orchestration
Service discovery
Scaling
Load distribution
Self-healing
Deployment management
📈 Monitoring with Prometheus

Prometheus is used to collect application and infrastructure metrics.

Spring Boot Application
          │
          ▼
       Metrics
          │
          ▼
      Prometheus
          │
          ▼
     Monitoring

Important metrics can include:

HTTP request count
HTTP response time
Error rate
JVM memory
CPU usage
Database connection pool usage
Application health
🔄 Complete System Flow

The complete application flow is:

                       USER
                         │
                         ▼
                  React Frontend
                         │
                         ▼
                  Authentication
                         │
                         ▼
                   JWT Token
                         │
                         ▼
                Spring Security
                         │
                         ▼
                Tenant Identification
                         │
                         ▼
                 Role Authorization
                         │
                         ▼
                  Expense Service
                         │
                         ▼
                Hibernate / JPA
                         │
                         ▼
                    PostgreSQL
                         │
                         ▼
                 Business Operation
                         │
                         ▼
                  Kafka Event
                         │
                         ▼
                 Audit Processing
                         │
                         ▼
                  Audit History
                         │
                         ▼
                  Prometheus
                    Monitoring
🧪 Testing Strategy

The application should be tested at multiple levels.

Unit Testing

Test individual services and components.

Examples:

Authentication Service
Expense Service
Approval Service
Reimbursement Service
Tenant Service
API Testing

Test REST endpoints:

Login
Register
Expenses
Approvals
Reimbursements
Reports
Audit
Users
Integration Testing

Verify:

React
   ↓
Spring Boot
   ↓
Hibernate
   ↓
PostgreSQL
Tenant Isolation Testing

Important security tests include:

Tenant A Login
      ↓
Request Tenant B Expense
      ↓
ACCESS DENIED

Expected result:

Tenant A → Tenant A Data ✅
Tenant A → Tenant B Data ❌
Tenant B → Tenant B Data ✅
Tenant B → Tenant A Data ❌
📁 Project Structure
multi-tenant-expense-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── ...
│   │       └── resources/
│   │           └── application.yml
│   ├── pom.xml
│   └── Dockerfile
│
├── database/
│   └── ...
│
├── kafka/
│   └── ...
│
├── docker/
│   └── ...
│
├── k8s/
│   ├── frontend.yaml
│   ├── backend.yaml
│   ├── postgres.yaml
│   └── kafka.yaml
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── AUDIT.md
│   ├── TESTING.md
│   └── TENANT-ISOLATION.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
🚀 Application Workflow
Step 1: Organization Registration

An organization registers on the platform.

Register Organization
        ↓
Create Tenant
        ↓
Create Admin User
Step 2: Authentication

The user logs in.

Email + Password
       ↓
Spring Security
       ↓
JWT
Step 3: Tenant Identification

The backend identifies the user's tenant from the authenticated context.

Step 4: Expense Submission

Employee creates an expense.

Employee
   ↓
Create Expense
   ↓
PENDING
Step 5: Approval

Manager reviews the expense.

PENDING
   │
   ├── APPROVE → APPROVED
   │
   └── REJECT  → REJECTED
Step 6: Reimbursement

Finance processes approved expenses.

APPROVED
   ↓
Finance
   ↓
REIMBURSED
Step 7: Audit

Every important operation produces an event.

Business Event
      ↓
Apache Kafka
      ↓
Audit Consumer
      ↓
Audit History
Step 8: Monitoring

Application metrics are collected by Prometheus.

🔐 Security Features

The application provides:

JWT authentication
Spring Security authorization
Role-based access control
Tenant-level data isolation
Password hashing
Secure REST APIs
Protected routes
Server-side authorization
Input validation
Audit logging
No frontend-controlled role switching
No hardcoded production credentials
Secure environment configuration
📈 Scalability

The architecture is designed to support increasing users and organizations.

             Load
              │
              ▼
       Kubernetes Service
              │
      ┌───────┼───────┐
      ▼       ▼       ▼
 Backend   Backend   Backend
   Pod       Pod       Pod
      │       │       │
      └───────┼───────┘
              ▼
          PostgreSQL

Kafka provides asynchronous event processing, while Kubernetes allows backend services to scale horizontally.

🌐 Deployment Architecture
                    Internet
                       │
                       ▼
                Kubernetes Cluster
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   React Frontend              Spring Boot
       Service                    Service
                                    │
                     ┌──────────────┼──────────────┐
                     ▼              ▼              ▼
                 PostgreSQL       Kafka        Prometheus
📋 Key Features
Multi-tenant SaaS architecture
Secure authentication
JWT-based authorization
Role-based access control
Tenant isolation
Expense creation and management
Manager approval workflow
Expense rejection
Finance reimbursement
Audit history
Expense reporting
Admin user management
Kafka-based event processing
PostgreSQL persistence
Hibernate ORM
HikariCP connection pooling
Docker containerization
Kubernetes deployment
Prometheus monitoring
🎓 Project Outcome

The project demonstrates how a real-world SaaS application can be designed using modern cloud-native technologies.

It combines:

Frontend
   +
Backend
   +
Security
   +
Database
   +
Multi-Tenancy
   +
Messaging
   +
Containerization
   +
Orchestration
   +
Monitoring

The final system provides a secure and scalable platform where multiple organizations can manage their expenses independently while sharing the same application infrastructure.

👨‍💻 Team Responsibilities
Member 1
Backend & Authentication
Spring Boot backend
REST APIs
Spring Security
JWT authentication
Business logic
Member 2
Database & Multi-Tenancy
PostgreSQL
Hibernate/JPA
Tenant isolation
Database design
HikariCP configuration
Member 3
Audit, Testing & Documentation
Audit history
Kafka event testing
API testing
Integration testing
Tenant isolation testing
Bug tracking
Documentation
Testing reports
PPT evidence
Audit History UI support
Member 4
Frontend & Deployment
React frontend
Dashboard
Expense UI
Approval UI
Reports
Docker
Kubernetes
Prometheus integration
📚 Documentation

Additional project documentation:

docs/
├── ARCHITECTURE.md
├── API.md
├── AUDIT.md
├── TESTING.md
└── TENANT-ISOLATION.md
🏁 Conclusion

The Multi-Tenant SaaS Expense Tracker provides a secure and scalable solution for managing organizational expenses.

The architecture follows a modern cloud-native approach using:

React + Spring Boot + Spring Security + PostgreSQL + Hibernate + HikariCP + Apache Kafka + Docker + Kubernetes + Prometheus

The system ensures that each organization operates within its own secure tenant boundary while benefiting from a centralized SaaS platform.


### One important correction



```text
User
→ Authentication
→ Tenant Identification
→ Role Authorization
→ Secure Data Access
→ Expense Processing
→ Kafka Event
→ Audit Processing
→ Audit History
→ Monitoring
