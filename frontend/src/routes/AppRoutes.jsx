import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import ManagerApprovals from '../pages/ManagerApprovals';
import FinanceReimbursements from '../pages/FinanceReimbursements';
import AuditHistory from '../pages/AuditHistory';
import Reports from '../pages/Reports';
import AdminUsers from '../pages/AdminUsers';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected SaaS Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Common Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Employee, Manager, Admin Expenses */}
          <Route
            path="/expenses"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']} />
            }
          >
            <Route index element={<Expenses />} />
          </Route>

          {/* Manager & Admin Approvals */}
          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />
            }
          >
            <Route index element={<ManagerApprovals />} />
          </Route>

          {/* Finance & Admin Reimbursements */}
          <Route
            path="/reimbursements"
            element={
              <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']} />
            }
          >
            <Route index element={<FinanceReimbursements />} />
          </Route>

          {/* Manager & Admin Audit History */}
          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />
            }
          >
            <Route index element={<AuditHistory />} />
          </Route>

          {/* Finance & Admin Reports */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']} />
            }
          >
            <Route index element={<Reports />} />
          </Route>

          {/* Admin User Management */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']} />
            }
          >
            <Route index element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
