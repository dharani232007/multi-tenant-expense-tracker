-- Sanity-check seed data (same shape as prisma/seed.ts)
-- Used here only to verify the schema + isolation logic work correctly.

INSERT INTO "Tenant" (id, name, plan, "isolationType", "updatedAt") VALUES
  ('tenant-a', 'TenantA', 'STANDARD', 'SHARED', now()),
  ('tenant-b', 'TenantB', 'STANDARD', 'SHARED', now()),
  ('tenant-c', 'TenantC', 'ENTERPRISE', 'PRIVATE_SCHEMA', now());

INSERT INTO "User" (id, "tenantId", name, email, "passwordHash", role, "updatedAt") VALUES
  ('user-a-admin', 'tenant-a', 'TenantA Admin', 'admin@tenanta.com', 'hash', 'ADMIN', now()),
  ('user-a-emp',   'tenant-a', 'TenantA Employee', 'employee@tenanta.com', 'hash', 'EMPLOYEE', now()),
  ('user-b-admin', 'tenant-b', 'TenantB Admin', 'admin@tenantb.com', 'hash', 'ADMIN', now()),
  ('user-b-emp',   'tenant-b', 'TenantB Employee', 'employee@tenantb.com', 'hash', 'EMPLOYEE', now());

INSERT INTO "Expense" (id, "tenantId", "userId", amount, category, description, date, status, "updatedAt") VALUES
  ('exp-a1', 'tenant-a', 'user-a-emp', 4500.00, 'TRAVEL', 'TenantA travel', now(), 'PENDING', now()),
  ('exp-b1', 'tenant-b', 'user-b-emp', 3000.00, 'FOOD',   'TenantB food',   now(), 'PENDING', now());

INSERT INTO "AuditEvent" (id, "tenantId", "expenseId", "userId", action, details) VALUES
  ('audit-a1', 'tenant-a', 'exp-a1', 'user-a-emp', 'CREATED', 'Created by TenantA employee'),
  ('audit-b1', 'tenant-b', 'exp-b1', 'user-b-emp', 'CREATED', 'Created by TenantB employee');

-- ============================================================
-- TEST 1: Tenant A requests its expenses -> only A's expenses
-- ============================================================
SELECT '--- TEST 1: Tenant A expenses only ---' AS test;
SELECT id, "tenantId", amount, category FROM "Expense" WHERE "tenantId" = 'tenant-a';

-- ============================================================
-- TEST 2: Tenant B requests its expenses -> only B's expenses
-- ============================================================
SELECT '--- TEST 2: Tenant B expenses only ---' AS test;
SELECT id, "tenantId", amount, category FROM "Expense" WHERE "tenantId" = 'tenant-b';

-- ============================================================
-- TEST 3: Tenant A tries to fetch a specific Tenant B expense id
-- by mistake/attack -> must return 0 rows (this is the query
-- pattern the backend MUST always use: WHERE id = ? AND tenantId = ?)
-- ============================================================
SELECT '--- TEST 3: Tenant A cannot fetch Tenant B expense exp-b1 ---' AS test;
SELECT id FROM "Expense" WHERE id = 'exp-b1' AND "tenantId" = 'tenant-a';
-- Expected: 0 rows

-- ============================================================
-- TEST 6: Tenant A tries to read Tenant B's audit events -> 0 rows
-- ============================================================
SELECT '--- TEST 6: Tenant A cannot read Tenant B audit events ---' AS test;
SELECT id FROM "AuditEvent" WHERE "tenantId" = 'tenant-a' AND "expenseId" = 'exp-b1';
-- Expected: 0 rows
