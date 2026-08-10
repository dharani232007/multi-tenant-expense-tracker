# DATABASE.md — Multi-Tenant Expense Tracker

Owner: Person 2 (Database + Multi-Tenancy + Security)
Stack: PostgreSQL + Prisma ORM

## 1. How to set up locally

```bash
cd database
npm install
```

Create a `.env` file (copy `.env.example`) and set your own local Postgres URL:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public"
```

Then run:

```bash
npx prisma migrate dev --name init   # creates tables from prisma/schema.prisma
npx prisma generate                  # generates the Prisma Client
npm run seed                         # inserts 3 tenants + sample data
npx prisma studio                    # optional: browse data in browser (localhost:5555)
```

## 2. Tables

| Table | Purpose |
|---|---|
| `Tenant` | one row per company using the SaaS |
| `User` | belongs to exactly one tenant (`tenantId` required) |
| `Expense` | belongs to a tenant AND a user |
| `AuditEvent` | immutable log of what happened to an expense |

Relationships:

```
Tenant 1---N User
Tenant 1---N Expense
Tenant 1---N AuditEvent
User   1---N Expense
Expense 1---N AuditEvent
```

## 3. Enum values (exact strings backend must use)

- `Plan`: `STANDARD`, `ENTERPRISE`
- `IsolationType`: `SHARED`, `PRIVATE_SCHEMA`
- `Role`: `ADMIN`, `EMPLOYEE`, `MANAGER`, `FINANCE`
- `ExpenseCategory`: `TRAVEL`, `FOOD`, `OFFICE`, `INFRASTRUCTURE`, `SALARY`, `EQUIPMENT`, `OTHER`
- `ExpenseStatus`: `PENDING`, `APPROVED`, `REJECTED`, `REIMBURSED`
- `AuditAction`: `CREATED`, `UPDATED`, `APPROVED`, `REJECTED`, `DELETED`

## 4. THE MOST IMPORTANT RULE (read this, backend dev)

**Every query that touches Expense, User, or AuditEvent MUST include `tenantId`.**
The `tenantId` must come from the **authenticated user's session/JWT**, never from
the frontend request body or query params.

Correct pattern:

```js
// tenantId comes from req.user.tenantId (set during auth), NOT from req.body
const expenses = await prisma.expense.findMany({
  where: { tenantId: req.user.tenantId },
});
```

To fetch a single record safely, always filter by BOTH id and tenantId together —
this is what stops Tenant A from ever reading Tenant B's record even by guessing an id:

```js
const expense = await prisma.expense.findFirst({
  where: { id: expenseId, tenantId: req.user.tenantId },
});
// if expense is null -> treat as "not found", return 404 (not 403 -> don't leak existence)
```

Never do this:

```js
// WRONG - trusts the frontend to say which tenant
const expenses = await prisma.expense.findMany({
  where: { tenantId: req.body.tenantId },
});
```

## 5. Inserting an audit event

Every create / update / approve / reject / delete on an Expense should also
insert an AuditEvent row, in the same request:

```js
await prisma.auditEvent.create({
  data: {
    tenantId: req.user.tenantId,
    expenseId: expense.id,
    userId: req.user.id,
    action: 'CREATED', // or UPDATED / APPROVED / REJECTED / DELETED
    details: 'Expense submitted for approval',
  },
});
```

AuditEvents are insert-only. Never update or delete a row in this table.

## 6. Indexes (why each one exists)

| Index | Reason |
|---|---|
| `User.tenantId` | fast "list all users of a tenant" |
| `User.email` (unique) | login lookup, and prevents duplicate accounts |
| `Expense.tenantId` | every expense list/report query filters by tenant first |
| `Expense.userId` | "my expenses" queries |
| `Expense.(tenantId, status)` | common query: "tenant X's pending expenses" |
| `AuditEvent.tenantId` | "all audit events for this tenant" |
| `AuditEvent.expenseId` | "full history of this one expense" |

## 7. Enterprise tenants (private schema) — future plan

For now (STANDARD plan), all tenants share the same tables and are isolated
purely by `tenantId` (see rule in section 4). This is fully working today.

For ENTERPRISE plan tenants that need a dedicated PostgreSQL schema later:
1. Create a new Postgres schema, e.g. `tenant_c`.
2. Run the same Prisma migrations against that schema
   (`?schema=tenant_c` in the connection string).
3. Copy that tenant's rows from the shared tables into the new schema.
4. Backend picks the connection/schema to use based on `Tenant.isolationType`.

This is a later-stage migration, not needed for the first working version.

## 8. Test data (after running `npm run seed`)

3 tenants, each with an Admin, Employee, and Manager:

- `admin@tenanta.com` / `employee@tenanta.com` / `manager@tenanta.com`
- `admin@tenantb.com` / `employee@tenantb.com` / `manager@tenantb.com`
- `admin@tenantc.com` / `employee@tenantc.com` / `manager@tenantc.com`

All passwords: `Password@123` (bcrypt-hashed in DB — for local dev only, never use in production).

## 9. Tenant isolation — verified test results

Ran against a local Postgres instance directly (see `tests/verify_seed.sql`):

| Test | Result |
|---|---|
| Tenant A requests its expenses | ✅ Only A's expense returned |
| Tenant B requests its expenses | ✅ Only B's expense returned |
| Tenant A fetches Tenant B expense by id + tenantId filter | ✅ 0 rows (blocked) |
| Tenant A reads Tenant B audit events | ✅ 0 rows (blocked) |

Foreign keys, unique constraints (`User.email`), and all indexes above were
created successfully and confirmed with `\dt` / `\d` in psql.
