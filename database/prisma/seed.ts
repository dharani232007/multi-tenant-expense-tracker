// ============================================================
// Seed script - creates 3 tenants (A, B, C), each with
// Admin + Employee + Manager users, some expenses, and audit events.
//
// Run with: npm run seed
// ============================================================

import { PrismaClient, Role, ExpenseCategory, ExpenseStatus, AuditAction, Plan, IsolationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTenant(name: string, plan: Plan, isolationType: IsolationType) {
  const tenant = await prisma.tenant.create({
    data: { name, plan, isolationType },
  });

  const passwordHash = await bcrypt.hash('Password@123', 10);

  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: `${name} Admin`,
      email: `admin@${name.toLowerCase()}.com`,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const employee = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: `${name} Employee`,
      email: `employee@${name.toLowerCase()}.com`,
      passwordHash,
      role: Role.EMPLOYEE,
    },
  });

  const manager = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: `${name} Manager`,
      email: `manager@${name.toLowerCase()}.com`,
      passwordHash,
      role: Role.MANAGER,
    },
  });

  // A couple of expenses created by the employee
  const expense1 = await prisma.expense.create({
    data: {
      tenantId: tenant.id,
      userId: employee.id,
      amount: 4500.0,
      category: ExpenseCategory.TRAVEL,
      description: `${name} - client visit travel`,
      date: new Date(),
      status: ExpenseStatus.PENDING,
    },
  });

  const expense2 = await prisma.expense.create({
    data: {
      tenantId: tenant.id,
      userId: employee.id,
      amount: 1200.0,
      category: ExpenseCategory.OFFICE,
      description: `${name} - office supplies`,
      date: new Date(),
      status: ExpenseStatus.APPROVED,
    },
  });

  // Audit trail for the expenses
  await prisma.auditEvent.create({
    data: {
      tenantId: tenant.id,
      expenseId: expense1.id,
      userId: employee.id,
      action: AuditAction.CREATED,
      details: 'Expense submitted for approval',
    },
  });

  await prisma.auditEvent.create({
    data: {
      tenantId: tenant.id,
      expenseId: expense2.id,
      userId: manager.id,
      action: AuditAction.APPROVED,
      details: 'Approved by manager',
    },
  });

  return { tenant, admin, employee, manager };
}

async function main() {
  console.log('Seeding database...');

  await createTenant('TenantA', Plan.STANDARD, IsolationType.SHARED);
  await createTenant('TenantB', Plan.STANDARD, IsolationType.SHARED);
  await createTenant('TenantC', Plan.ENTERPRISE, IsolationType.PRIVATE_SCHEMA);

  console.log('Seeding complete: 3 tenants, 9 users, 6 expenses, 6 audit events.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
