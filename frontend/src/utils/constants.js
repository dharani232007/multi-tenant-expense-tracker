// Application Constants & Shared Enums

export const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  FINANCE: 'FINANCE',
  ADMIN: 'ADMIN',
};

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Food',
  'Office',
  'Infrastructure',
  'Salary',
  'Equipment',
  'Other',
];

export const EXPENSE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const REIMBURSEMENT_STATUS = {
  UNPAID: 'UNPAID',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
};

export const AUDIT_ACTIONS = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED',
};
