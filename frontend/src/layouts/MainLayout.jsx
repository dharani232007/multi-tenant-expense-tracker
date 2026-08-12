import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Building2,
  LayoutDashboard,
  Receipt,
  CheckSquare,
  DollarSign,
  History,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { ROLES } from '../utils/constants';

export default function MainLayout() {
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav Links defined strictly per role requirement
  const getNavLinks = () => {
    const role = user?.role || 'EMPLOYEE';

    const links = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'] },
      { path: '/expenses', label: role === 'EMPLOYEE' ? 'My Expenses' : 'Expenses', icon: Receipt, roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
      { path: '/approvals', label: 'Pending Approvals', icon: CheckSquare, roles: ['MANAGER', 'ADMIN'] },
      { path: '/reimbursements', label: role === 'FINANCE' ? 'Approved & Payouts' : 'Reimbursements', icon: DollarSign, roles: ['FINANCE', 'ADMIN'] },
      { path: '/audit', label: 'Audit History', icon: History, roles: ['MANAGER', 'ADMIN'] },
      { path: '/reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['FINANCE', 'ADMIN'] },
      { path: '/users', label: 'User Directory', icon: Users, roles: ['ADMIN'] },
    ];

    return links.filter(link => link.roles.includes(role));
  };

  const navLinks = getNavLinks();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      {/* Mobile Menu Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 22, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`sidebar-container ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          boxShadow: 'var(--shadow-md)',
          transition: 'var(--transition)'
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', background: 'var(--primary-gradient)', borderRadius: 'var(--radius-md)', color: '#ffffff', boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)' }}>
              <Building2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Expensify SaaS</h2>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
                <span className="pulse-dot" style={{ color: 'var(--success)' }}></span>
                <span style={{ fontWeight: '600' }}>{user?.companyName || user?.tenantId || 'Acme Tenant'}</span>
              </div>
            </div>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1.25rem 0.75rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '0.5rem 0.75rem 0.75rem', textTransform: 'uppercase' }}>
            Navigation • {user?.role}
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.35rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'var(--transition)',
                })}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Developer Role Switcher */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-input)' }}>
          <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={12} color="var(--primary)" /> Role Evaluator Switcher:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
            {Object.values(ROLES).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`btn btn-sm ${user?.role === r ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.65rem', padding: '0.3rem 0.25rem', fontWeight: '700' }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* User Account Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-footer)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0, boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} title="Sign Out" style={{ color: 'var(--danger)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper" style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navigation Bar */}
        <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'var(--bg-header)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} style={{ color: 'var(--text-primary)', padding: '0.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Menu size={22} />
            </button>
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authenticated Session</span>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="gradient-text">{user?.companyName || user?.tenantId || 'Tenant Alpha'}</span>
                <span className="badge badge-approved" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>
                  <span className="pulse-dot"></span> Backend API Secured
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: '600' }}
              title={`Switch to ${theme === 'dark' ? 'White (Light)' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} color="#f59e0b" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={16} color="#6366f1" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <span className="badge badge-role" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.95rem', fontSize: '0.75rem' }}>
              <Shield size={14} /> Active Role: {user?.role}
            </span>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
