import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportService, expenseService } from '../services/api';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Receipt,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldAlert,
  CreditCard,
  Building2,
  Users
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sumData, expData] = await Promise.all([
        reportService.getSummary(),
        expenseService.getAll()
      ]);
      setSummary(sumData);
      setRecentExpenses(expData.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading tenant dashboard metrics...</div>;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', background: 'var(--banner-bg)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-role">{user?.role} DASHBOARD</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Tenant Workspace: <strong>{user?.companyName || user?.tenantId || 'Tenant Alpha'}</strong></span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }} className="gradient-text">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Overview of organization expenses, approvals, and budget status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {(user?.role === 'EMPLOYEE' || user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
            <Link to="/expenses" className="btn btn-primary">
              <PlusCircle size={18} /> Submit Expense Claim
            </Link>
          )}
          {user?.role === 'MANAGER' && (
            <Link to="/approvals" className="btn btn-secondary">
              <Clock size={18} /> Review Approvals ({summary?.pendingExpenses || 0})
            </Link>
          )}
          {user?.role === 'FINANCE' && (
            <Link to="/reimbursements" className="btn btn-secondary">
              <CreditCard size={18} /> Manage Payouts
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Total Spent */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Amount Spent</span>
            <div style={{ padding: '0.6rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            ${summary?.totalAmountSpent ? summary.totalAmountSpent.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem', fontWeight: '600' }}>
            <TrendingUp size={14} /> Verified Approved Total
          </span>
        </div>

        {/* Pending Expenses */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Pending Expenses</span>
            <div style={{ padding: '0.6rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
              <Clock size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {summary?.pendingExpenses || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Awaiting manager approval
          </span>
        </div>

        {/* Approved Expenses */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Approved Expenses</span>
            <div style={{ padding: '0.6rem', background: 'var(--success-light)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
              <CheckCircle size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {summary?.approvedExpenses || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Ready for reimbursement
          </span>
        </div>

        {/* Rejected Expenses */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Rejected Expenses</span>
            <div style={{ padding: '0.6rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger)' }}>
              <XCircle size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {summary?.rejectedExpenses || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Declined by management
          </span>
        </div>
      </div>

      {/* Grid: Recent Expenses Table & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Expenses List */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recent Organization Expenses</h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Latest activity logged for your tenant</p>
            </div>
            <Link to="/expenses" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No recent expenses found.</div>
            ) : (
              recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.925rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span>👤 {exp.user}</span> • <span>🏷️ {exp.category}</span> • <span>📅 {exp.date}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>${exp.amount.toFixed(2)}</div>
                    <span className={`badge badge-${exp.status.toLowerCase()}`} style={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expense Category Summary Breakdown */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Expense Category Summary</h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Expenditure distribution across categories</p>
            </div>
            <PieChart size={20} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {summary?.categorySummary && Object.keys(summary.categorySummary).length > 0 ? (
              Object.entries(summary.categorySummary).map(([category, amount]) => {
                const percentage = summary.totalAmountSpent > 0 ? Math.round((amount / summary.totalAmountSpent) * 100) : 0;
                return (
                  <div key={category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{category}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>${amount.toFixed(2)} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(percentage, 100)}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No category data logged yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
