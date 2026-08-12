import React, { useState, useEffect } from 'react';
import { auditService } from '../services/api';
import { History, Shield, Filter, Activity } from 'lucide-react';
import { AUDIT_ACTIONS } from '../utils/constants';

export default function AuditHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await auditService.getLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    return filterAction ? log.action === filterAction : true;
  });

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'CREATED': return 'badge-role';
      case 'APPROVED': return 'badge-approved';
      case 'REJECTED': return 'badge-rejected';
      case 'DELETED': return 'badge-rejected';
      case 'UPDATED': return 'badge-pending';
      default: return 'badge-category';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Organization Audit Log</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Immutable audit history for all creation, updates, manager approvals & deletions
          </p>
        </div>

        {/* Filter Dropdown */}
        <div style={{ minWidth: '180px' }}>
          <select
            className="form-select"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="">All Action Types</option>
            {Object.values(AUDIT_ACTIONS).map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading system audit trail...</div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Activity size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p style={{ fontWeight: '600' }}>No Audit Entries Found</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Action Type</th>
                <th>User / Actor</th>
                <th>Target Expense ID</th>
                <th>Timestamp</th>
                <th>Audit Summary Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.id}</td>
                  <td>
                    <span className={`badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{log.user}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: '600' }}>{log.expenseId}</td>
                  <td>{new Date(log.date).toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
