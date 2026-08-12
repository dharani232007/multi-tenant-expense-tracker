import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, Eye, AlertCircle, MessageSquare } from 'lucide-react';

export default function ManagerApprovals() {
  const { user } = useAuth();
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection Modal
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAll({ status: 'PENDING' });
      setPendingExpenses(data);
    } catch (err) {
      console.error('Error fetching pending approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await expenseService.approve(id, user);
      fetchPending();
    } catch (err) {
      alert('Approval failed: ' + err.message);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingItem || !rejectionReason.trim()) return;
    setSubmitting(true);
    try {
      await expenseService.reject(rejectingItem.id, rejectionReason, user);
      setRejectingItem(null);
      setRejectionReason('');
      fetchPending();
    } catch (err) {
      alert('Rejection failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manager Approval Workspace</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Review pending employee claims, grant approvals, or decline with feedback
        </p>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading pending claims queue...</div>
        ) : pendingExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={40} color="var(--success)" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
            <p style={{ fontWeight: '600' }}>Queue Clean & All Caught Up!</p>
            <p style={{ fontSize: '0.85rem' }}>There are currently no pending expenses requiring approval.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Employee Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Submitted Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Decision Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{exp.id}</td>
                  <td>{exp.user}</td>
                  <td><span className="badge badge-category">{exp.category}</span></td>
                  <td>{exp.description}</td>
                  <td>{exp.date}</td>
                  <td style={{ fontWeight: '700', fontSize: '1rem' }}>${exp.amount.toFixed(2)}</td>
                  <td><span className="badge badge-pending">PENDING</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleApprove(exp.id)}
                        className="btn btn-success btn-sm"
                        title="Approve Expense"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => {
                          setRejectingItem(exp);
                          setRejectionReason('');
                        }}
                        className="btn btn-danger btn-sm"
                        title="Reject Expense"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reject Reason Input Modal */}
      {rejectingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '1rem' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Reject Expense Claim</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Rejecting claim <strong>{rejectingItem.id}</strong> submitted by <strong>{rejectingItem.user}</strong> (${rejectingItem.amount.toFixed(2)}).
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label className="form-label">Rejection Reason / Manager Feedback</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Explain why this claim was declined (e.g. Budget limit exceeded, missing receipt detail)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-danger"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
