import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../utils/constants';

export default function ExpenseModal({ isOpen, onClose, onSubmit, initialData = null, isEditing = false }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Travel');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount || '');
      setCategory(initialData.category || 'Travel');
      setDescription(initialData.description || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
    } else {
      setAmount('');
      setCategory('Travel');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive expense amount.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a brief description.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        amount: parseFloat(amount),
        category,
        description,
        date,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit expense.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
            {isEditing ? 'Edit Expense Record' : 'Create New Expense Claim'}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Expense Amount ($)</label>
            <input
              type="number"
              step="0.01"
              required
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Business Purpose</label>
            <textarea
              required
              rows={3}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context (e.g. Flight ticket for quarterly client review)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              required
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {isEditing ? <Save size={16} /> : <Plus size={16} />}
              {submitting ? 'Saving...' : (isEditing ? 'Update Expense' : 'Submit Claim')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
