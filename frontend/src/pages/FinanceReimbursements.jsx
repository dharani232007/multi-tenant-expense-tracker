import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import { DollarSign, CheckCircle2, Clock, CreditCard, RefreshCw } from 'lucide-react';
import { REIMBURSEMENT_STATUS } from '../utils/constants';

export default function FinanceReimbursements() {
  const [approvedExpenses, setApprovedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAll({ status: 'APPROVED' });
      setApprovedExpenses(data);
    } catch (err) {
      console.error('Error fetching approved expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await expenseService.updateReimbursement(id, status);
      fetchApproved();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const totalApprovedAmount = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPaidAmount = approvedExpenses.filter(e => e.reimbursementStatus === 'PAID').reduce((sum, e) => sum + e.amount, 0);
  const totalPendingPayout = totalApprovedAmount - totalPaidAmount;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Finance & Reimbursements</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Process payouts for manager-approved employee expense claims
        </p>
      </div>

      {/* Summary Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Approved Claims</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>
            ${totalApprovedAmount.toFixed(2)}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Payouts</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)', marginTop: '0.25rem' }}>
            ${totalPendingPayout.toFixed(2)}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Disbursed / Paid Out</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)', marginTop: '0.25rem' }}>
            ${totalPaidAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading finance ledger...</div>
        ) : approvedExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <DollarSign size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p style={{ fontWeight: '600' }}>No Approved Claims Available</p>
            <p style={{ fontSize: '0.85rem' }}>Approved expenses will automatically populate here for payout processing.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Employee / Recipient</th>
                <th>Category</th>
                <th>Claim Date</th>
                <th>Amount</th>
                <th>Payout Status</th>
                <th>Update Reimbursement State</th>
              </tr>
            </thead>
            <tbody>
              {approvedExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{exp.id}</td>
                  <td>{exp.user}</td>
                  <td><span className="badge badge-category">{exp.category}</span></td>
                  <td>{exp.date}</td>
                  <td style={{ fontWeight: '700' }}>${exp.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      exp.reimbursementStatus === 'PAID'
                        ? 'badge-approved'
                        : exp.reimbursementStatus === 'PROCESSING'
                        ? 'badge-pending'
                        : 'badge-rejected'
                    }`}>
                      {exp.reimbursementStatus || 'UNPAID'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {exp.reimbursementStatus !== 'PROCESSING' && exp.reimbursementStatus !== 'PAID' && (
                        <button
                          onClick={() => handleUpdateStatus(exp.id, 'PROCESSING')}
                          className="btn btn-secondary btn-sm"
                        >
                          <Clock size={14} /> Processing
                        </button>
                      )}
                      {exp.reimbursementStatus !== 'PAID' && (
                        <button
                          onClick={() => handleUpdateStatus(exp.id, 'PAID')}
                          className="btn btn-success btn-sm"
                        >
                          <CreditCard size={14} /> Mark Paid
                        </button>
                      )}
                      {exp.reimbursementStatus === 'PAID' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                          <CheckCircle2 size={16} /> Disbursed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
