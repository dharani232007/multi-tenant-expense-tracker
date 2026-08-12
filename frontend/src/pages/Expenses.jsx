import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExpenseModal from '../components/ExpenseModal';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  Check,
  Calendar,
  Tag,
  DollarSign,
  User,
  Info
} from 'lucide-react';
import { EXPENSE_CATEGORIES, EXPENSE_STATUS } from '../utils/constants';

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Toast Notification Message
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory, selectedStatus]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAll({
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
      });
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (data) => {
    await expenseService.create(data, user);
    showToast('✨ Expense claim submitted successfully!');
    fetchExpenses();
  };

  const handleUpdateExpense = async (data) => {
    if (!editingExpense) return;
    await expenseService.update(editingExpense.id, data, user);
    setEditingExpense(null);
    showToast('✏️ Expense updated successfully!');
    fetchExpenses();
  };

  const handleDeleteExpense = async (id) => {
    await expenseService.delete(id, user);
    setDeletingId(null);
    showToast('🗑️ Expense claim deleted.');
    fetchExpenses();
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      {/* Toast Feedback Banner */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <Check size={18} color="var(--success)" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }} className="gradient-text">Expense Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Submit new expense claims, track statuses, and view organizational audit history
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Add New Expense
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search description, employee name, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div style={{ minWidth: '170px' }}>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: '170px' }}>
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {Object.values(EXPENSE_STATUS).map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading expenses list...</div>
        ) : filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ marginBottom: '0.75rem', opacity: 0.4, color: 'var(--primary)' }} />
            <p style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>No Expenses Found</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>No expense records match your search criteria.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Employee / User</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Approval Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: '700', color: '#818cf8' }}>{exp.id}</td>
                  <td style={{ fontWeight: '600' }}>{exp.user}</td>
                  <td>
                    <span className="badge badge-category">{exp.category}</span>
                  </td>
                  <td>{exp.description}</td>
                  <td>{exp.date}</td>
                  <td style={{ fontWeight: '800', color: '#ffffff' }}>${exp.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${exp.status.toLowerCase()}`}>
                      <span className="pulse-dot"></span> {exp.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button
                        onClick={() => setViewingExpense(exp)}
                        className="btn btn-secondary btn-sm"
                        title="View Details"
                      >
                        <Eye size={14} /> View
                      </button>
                      {(exp.status === 'PENDING' || user?.role === 'ADMIN') && (
                        <>
                          <button
                            onClick={() => setEditingExpense(exp)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Record"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingId(exp.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      <ExpenseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateExpense}
      />

      {/* Edit Modal */}
      <ExpenseModal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSubmit={handleUpdateExpense}
        initialData={editingExpense}
        isEditing={true}
      />

      {/* Detail View Modal */}
      {viewingExpense && (
        <div className="modal-overlay" onClick={() => setViewingExpense(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }} className="gradient-text">
                Expense Claim Details
              </h3>
              <span className={`badge badge-${viewingExpense.status.toLowerCase()}`}>
                {viewingExpense.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Claim ID</span>
                <div style={{ fontWeight: '800', color: '#818cf8', fontSize: '1rem' }}>{viewingExpense.id}</div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Submitted By</span>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#ffffff' }}>{viewingExpense.user}</div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Expense Amount</span>
                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--success)' }}>${viewingExpense.amount.toFixed(2)}</div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Category & Date</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                  <span className="badge badge-category">{viewingExpense.category}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{viewingExpense.date}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Description / Business Purpose</span>
              <p style={{ marginTop: '0.35rem', padding: '0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                {viewingExpense.description}
              </p>
            </div>

            {viewingExpense.rejectionReason && (
              <div style={{ padding: '1rem', background: 'var(--danger-light)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>⚠️ Manager Rejection Reason:</strong>
                {viewingExpense.rejectionReason}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => setViewingExpense(null)} className="btn btn-secondary">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Delete Expense Claim?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete expense claim <strong>{deletingId}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => setDeletingId(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleDeleteExpense(deletingId)} className="btn btn-danger">
                Yes, Delete Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
