import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { BarChart3, PieChart, TrendingUp, DollarSign, Award, Percent } from 'lucide-react';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await reportService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Generating organization expenditure reports...</div>;
  }

  const total = summary?.totalExpenses || 0;
  const approvedPct = total > 0 ? Math.round(((summary?.approvedExpenses || 0) / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round(((summary?.pendingExpenses || 0) / total) * 100) : 0;
  const rejectedPct = total > 0 ? Math.round(((summary?.rejectedExpenses || 0) / total) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Reports & Expenditure Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Visual insights into tenant spending metrics, category distributions, and approval rates
        </p>
      </div>

      {/* Grid Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Approved Spent</span>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginTop: '0.25rem' }}>
            ${summary?.totalAmountSpent ? summary.totalAmountSpent.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Approval Conversion Rate</span>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success)', marginTop: '0.25rem' }}>
            {approvedPct}%
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Claims Processed</span>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.25rem' }}>
            {total}
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Status Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Approval Status Breakdown</h3>
            <PieChart size={20} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>Approved Claims ({summary?.approvedExpenses})</span>
                <span>{approvedPct}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${approvedPct}%`, height: '100%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ color: 'var(--warning)', fontWeight: '600' }}>Pending Approval ({summary?.pendingExpenses})</span>
                <span>{pendingPct}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${pendingPct}%`, height: '100%', backgroundColor: 'var(--warning)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Rejected Claims ({summary?.rejectedExpenses})</span>
                <span>{rejectedPct}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${rejectedPct}%`, height: '100%', backgroundColor: 'var(--danger)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Category Expenditure Bar Visual */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Expenditure by Category ($)</h3>
            <BarChart3 size={20} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {summary?.categorySummary && Object.entries(summary.categorySummary).map(([cat, amount]) => {
              const maxVal = Math.max(...Object.values(summary.categorySummary), 1);
              const barWidth = Math.round((amount / maxVal) * 100);
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '500' }}>{cat}</span>
                    <span style={{ fontWeight: '700' }}>${amount.toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${barWidth}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #3b82f6)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
