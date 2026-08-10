# Multi-Tenant SaaS Expense Tracker

## 📌 Project Overview

The **Multi-Tenant SaaS Expense Tracker** is a cloud-based Software-as-a-Service (SaaS) application designed to help multiple organizations or customers manage their expenses securely within a single platform.

The system follows a **multi-tenant architecture**, where multiple customers (tenants) can use the same application while keeping their data logically isolated and secure.

The application allows users to:

* Register and log in securely
* Belong to a specific tenant/organization
* Add, edit, view, and delete expenses
* Categorize expenses
* Track spending
* View expense summaries and reports
* Access only the data belonging to their organization
* Scale according to the number of users and tenants

---

# 🎯 Problem Statement

Traditional expense management systems may require separate applications or infrastructure for different organizations. This can increase infrastructure costs, maintenance effort, and operational complexity.

The goal of this project is to develop a **Multi-Tenant SaaS Expense Tracker** where multiple organizations can use the same application while maintaining proper data isolation.

The system should:

1. Support multiple tenants.
2. Keep tenant data isolated.
3. Provide secure authentication and authorization.
4. Allow users to manage expense records.
5. Support different data-isolation strategies for different tenant sizes.
6. Provide scalable infrastructure.
7. Maintain permanent expense records.
8. Support monitoring and deployment using cloud-native technologies.

---

# 💡 Proposed Solution

Our solution uses a **multi-tenant SaaS architecture**.

Each request is associated with a specific tenant/customer identity. The backend identifies the tenant before accessing data.

The system can support different storage strategies:

### Small / Standard Tenants

Multiple tenants can share the same PostgreSQL database while their data remains logically separated using tenant identifiers.

Example:

```text
Database
│
├── Expenses
│     ├── tenant_id = T001
│     ├── tenant_id = T002
│     └── tenant_id = T003
│
└── Users
      ├── tenant_id = T001
      ├── tenant_id = T002
      └── tenant_id = T003
```

### Large / Premium Tenants

Large customers can be provided with a dedicated database schema or dedicated database depending on their requirements.

Example:

```text
PostgreSQL
│
├── tenant_a_schema
│     ├── users
│     └── expenses
│
├── tenant_b_schema
│     ├── users
│     └── expenses
│
└── shared_schema
      └── common_data
```

This approach provides flexibility, security, and scalability.

---

# 🏗️ System Architecture

The high-level architecture is:

```text
                    ┌──────────────────────┐
                    │       Users          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React Frontend    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      API Gateway     │
                    └──────────┬───────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │       Spring Boot Backend      │
              │                                │
              │ Authentication & Authorization │
              │ Tenant Identification          │
              │ Expense Management              │
              │ Multi-Tenancy Logic             │
              └───────────────┬────────────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │ PostgreSQL │   │   Kafka    │   │ Monitoring │
       │  Database  │   │   Events   │   │ Prometheus │
       └────────────┘   └────────────┘   └────────────┘
                              │
                              ▼
                       ┌────────────┐
                       │ Consumers  │
                       └────────────┘
```

---

# 🛠️ Technologies Used

## Frontend

* React.js
* JavaScript
* HTML5
* CSS
* Axios
* React Router

## Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* Hibernate Multi-Tenancy
* HikariCP
* REST APIs

## Database

* PostgreSQL
* Hibernate ORM

## Messaging

* Apache Kafka

## DevOps / Deployment

* Docker
* Docker Compose
* Kubernetes

## Monitoring

* Prometheus

## Version Control

* Git
* GitHub

---

# 📂 Project Folder Structure

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
│   ├── pom.xml
│   └── README.md
│
├── database/
│   ├── schema/
│   ├── migrations/
│   └── seed/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── screenshots/
│
├── docker-compose.yml
│
├── .gitignore
│
└── README.md
```

---

# 👥 Team Members

| Member   | Role                            | Main Responsibility                                          |
| -------- | ------------------------------- | ------------------------------------------------------------ |
| Member 1 | Team Leader / Backend Developer | Backend APIs, authentication, tenant management, integration |
| Member 2 | Frontend Developer              | React UI, dashboard, expense screens                         |
| Member 3 | Database Developer              | PostgreSQL schema, tables, relationships, database setup     |
| Member 4 | DevOps / Integration Developer  | Docker, Kafka, Kubernetes, monitoring, deployment            |

> Replace the member names and roles with the actual team information.

---

# 🔐 Main Features

## 1. Authentication

Users can:

* Register
* Login
* Logout
* Access protected resources
* Authenticate using secure credentials

Spring Security will be used for authentication and authorization.

---

## 2. Tenant Management

Every user belongs to a specific tenant/organization.

Example:

```text
Tenant A
├── User 1
├── User 2
└── Expenses

Tenant B
├── User 3
├── User 4
└── Expenses
```

A user from Tenant A must not be able to access Tenant B's data.

---

## 3. Expense Management

Users can:

* Add expenses
* View expenses
* Update expenses
* Delete expenses
* Categorize expenses
* Search expenses
* Filter expenses
* View expense history

Example expense:

```text
Expense ID: EXP001
Tenant ID: TEN001
User ID: USER001
Category: Food
Amount: ₹500
Date: 2026-08-10
Description: Team Lunch
```

---

## 4. Tenant Data Isolation

Tenant isolation is one of the most important features of this project.

Every request must be associated with a tenant.

Example:

```text
Request
   ↓
Authentication
   ↓
Identify User
   ↓
Identify Tenant
   ↓
Validate Tenant Access
   ↓
Query Tenant Data
   ↓
Return Response
```

The application must prevent users from accessing data belonging to another tenant.

---

## 5. Expense Permanence

Expense records should not be accidentally lost.

Important expense information must be stored reliably in PostgreSQL.

Database operations should maintain data consistency and integrity.

---

## 6. Scalability

The application should be designed to support increasing numbers of:

* Users
* Tenants
* Expense records
* API requests

Docker and Kubernetes can be used to support scalable deployment.

---

# 🔄 Request Flow

A typical request follows this process:

```text
User
 ↓
React Frontend
 ↓
HTTP Request
 ↓
Authentication
 ↓
Tenant Identification
 ↓
Authorization
 ↓
Spring Boot Controller
 ↓
Service Layer
 ↓
Repository Layer
 ↓
PostgreSQL
 ↓
Response
 ↓
React Frontend
 ↓
User
```

---

# 📨 Kafka Event Flow

Kafka can be used for asynchronous operations and event-driven communication.

Example:

```text
User Adds Expense
       ↓
Spring Boot Backend
       ↓
Save Expense
       ↓
Publish Expense Event
       ↓
Kafka Topic
       ↓
Kafka Consumer
       ↓
Process Event
```

Possible events include:

```text
ExpenseCreated
ExpenseUpdated
ExpenseDeleted
```

---

# 🐳 Docker

Docker is used to create consistent environments for development and deployment.

Possible containers:

```text
Docker
│
├── Frontend
├── Backend
├── PostgreSQL
├── Kafka
├── Zookeeper / Kafka dependency
└── Prometheus
```

The project can be started using:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

---

# ☸️ Kubernetes

Kubernetes can be used for container orchestration and scalability.

Possible Kubernetes components:

```text
Kubernetes Cluster
│
├── Frontend Deployment
├── Backend Deployment
├── PostgreSQL
├── Kafka
└── Monitoring
```

Kubernetes can help with:

* Scaling
* Service discovery
* Container management
* Health checks
* Rolling updates

---

# 📊 Monitoring

Prometheus can be used to monitor the application.

Possible metrics include:

* API request count
* Response time
* Error rate
* CPU usage
* Memory usage
* Application health
* Service availability

---

# 🚀 Getting Started

## Prerequisites

Install the following software before running the project:

* Git
* Java JDK
* Maven
* Node.js
* npm
* PostgreSQL
* Docker Desktop
* Docker Compose

Optional:

* Kubernetes
* kubectl

---

# 📥 Clone the Repository

Clone the repository using:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Move into the project directory:

```bash
cd multi-tenant-expense-tracker
```

---

# 🌿 Git Branch Structure

The project uses the following branch structure:

```text
main
│
└── develop
    │
    ├── feature/backend
    ├── feature/frontend
    ├── feature/database
    └── feature/devops
```

## Branch Responsibilities

### `main`

Contains the stable and final version of the project.

Only tested code should be merged into `main`.

### `develop`

Used for integrating completed features before the final release.

### `feature/backend`

Backend development.

### `feature/frontend`

Frontend development.

### `feature/database`

Database development.

### `feature/devops`

Docker, Kubernetes, Kafka, monitoring, and deployment work.

---

# 🔀 Git Workflow

Every team member should follow this workflow.

## Step 1: Get the latest code

```bash
git checkout develop
git pull origin develop
```

## Step 2: Create or switch to your feature branch

Example:

```bash
git checkout -b feature/backend
```

For frontend:

```bash
git checkout -b feature/frontend
```

For database:

```bash
git checkout -b feature/database
```

For DevOps:

```bash
git checkout -b feature/devops
```

---

## Step 3: Work on your assigned task

Only modify the files related to your assigned responsibility.

---

## Step 4: Check your changes

```bash
git status
```

Review the files before committing.

---

## Step 5: Add changes

```bash
git add .
```

---

## Step 6: Commit changes

Use a meaningful commit message.

Example:

```bash
git commit -m "Add expense creation API"
```

Other examples:

```bash
git commit -m "Create expense dashboard UI"
git commit -m "Add tenant database schema"
git commit -m "Configure Docker environment"
```

---

## Step 7: Push your branch

```bash
git push origin feature/backend
```

Replace the branch name according to your role.

---

# 🔃 Pull Request Workflow

After completing a task:

```text
Feature Branch
      ↓
Push to GitHub
      ↓
Create Pull Request
      ↓
Review
      ↓
Fix Issues if Required
      ↓
Merge into develop
```

Team members should **not directly push to `main`**.

The team leader will review Pull Requests before merging.

---

# ⚠️ Important Git Rules

1. Do not directly modify `main`.
2. Do not push another person's work into your branch.
3. Always pull the latest `develop` before starting new work.
4. Use meaningful commit messages.
5. Create a Pull Request after completing a feature.
6. Do not commit passwords, API keys, or secrets.
7. Do not commit `.env` files containing real credentials.
8. Resolve merge conflicts carefully.
9. Test your changes before creating a Pull Request.
10. Do not delete another person's work without discussion.

---

# 🔒 Environment Variables

Sensitive information should not be stored directly in the source code.

Example:

```text
DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=

KAFKA_BOOTSTRAP_SERVERS=
```

Create a local `.env` file when required.

Make sure `.env` is included in `.gitignore`.

Never upload real passwords, tokens, or API keys to GitHub.

---

# 🧪 Testing

Before creating a Pull Request, verify:

### Backend

* Application starts successfully
* APIs work correctly
* Authentication works
* Tenant isolation works
* Database operations work
* Invalid requests are handled

### Frontend

* Application starts successfully
* Pages load correctly
* API integration works
* Forms work correctly
* Authentication flow works
* Dashboard displays correct information

### Integration

* Frontend communicates with backend
* Backend communicates with PostgreSQL
* Kafka communication works where implemented
* Docker containers start correctly

---

# 📝 API Documentation

Backend APIs should be documented in:

```text
docs/api/
```

Example:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/expenses
POST   /api/expenses
GET    /api/expenses/{id}
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}
```

The exact API endpoints may change during development.

---

# 📚 Documentation

Project documentation should be maintained inside:

```text
docs/
```

Recommended documentation:

```text
docs/
├── architecture/
│   ├── system-architecture.md
│   └── multi-tenancy.md
│
├── api/
│   └── api-documentation.md
│
└── screenshots/
```

---

# 🗓️ Development Process

The project development will follow these stages:

## Phase 1: Project Setup

* Create GitHub repository
* Configure branches
* Create folder structure
* Configure development environments

## Phase 2: Database

* Design database
* Create tenant structure
* Create user structure
* Create expense structure
* Add relationships
* Add sample data

## Phase 3: Backend

* Create Spring Boot project
* Configure PostgreSQL
* Implement authentication
* Implement authorization
* Implement tenant identification
* Implement expense APIs
* Implement multi-tenancy

## Phase 4: Frontend

* Create React application
* Create login/register pages
* Create dashboard
* Create expense management pages
* Connect frontend with backend APIs

## Phase 5: Messaging

* Configure Kafka
* Create topics
* Publish expense events
* Implement consumers

## Phase 6: DevOps

* Create Dockerfiles
* Configure Docker Compose
* Configure Kubernetes
* Configure monitoring

## Phase 7: Integration

* Connect all components
* Test complete application
* Fix integration issues
* Test tenant isolation

## Phase 8: Final Testing

* Functional testing
* Security testing
* Multi-tenant isolation testing
* Performance testing
* Deployment testing

---

# 🎯 Expected Final Result

The final system should provide:

```text
                    Multi-Tenant SaaS
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Tenant A         Tenant B         Tenant C
          │                │                │
       Users            Users            Users
          │                │                │
      Expenses         Expenses         Expenses
```

Each tenant should be able to use the same application while its data remains isolated from other tenants.

---

# 👨‍💻 Team Collaboration

All team members are responsible for:

* Completing assigned tasks
* Maintaining clean code
* Following the Git workflow
* Testing their changes
* Communicating blockers
* Creating Pull Requests
* Reviewing code when requested
* Keeping documentation updated

The team leader is responsible for:

* Repository management
* Branch management
* Task coordination
* Reviewing Pull Requests
* Integrating team members' work
* Final testing
* Final deployment coordination

---

# 📌 Project Status

Current status:

```text
[ ] Repository setup
[ ] Team members invited
[ ] Branches created
[ ] Project structure created
[ ] Database setup
[ ] Backend development
[ ] Frontend development
[ ] Authentication
[ ] Multi-tenancy
[ ] Expense management
[ ] Kafka integration
[ ] Docker setup
[ ] Kubernetes setup
[ ] Monitoring
[ ] Integration testing
[ ] Final testing
[ ] Deployment
```

---

# 📄 License

This project is developed as an academic/hackathon project.

---

# 🙌 Team

**Project:** Multi-Tenant SaaS Expense Tracker

**Team:** [Your Team Name]

**Institution:** [Your College Name]

**Year:** 2026
