import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const staffLinks = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/books', label: '📚 Books' },
    { path: '/members', label: '👥 Members' },
    { path: '/transactions', label: '🔄 Transactions' },
  ];
  const navLinks = user?.role === 'member' ? staffLinks.slice(0, 1) : staffLinks;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#4f46e5', padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '64px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '22px' }}>📖</span>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>LibraryMS</span>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {navLinks.map(link => (
          <Link key={link.path} to={link.path} style={{
            color: location.pathname === link.path ? '#c7d2fe' : 'rgba(255,255,255,0.8)',
            textDecoration: 'none', padding: '8px 16px', borderRadius: '8px',
            fontSize: '14px', fontWeight: '500',
            background: location.pathname === link.path ? 'rgba(255,255,255,0.15)' : 'transparent'
          }}>{link.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>👤 {user?.name}</span>
        <button onClick={logout} style={{
          background: 'rgba(255,255,255,0.2)', color: 'white',
          border: 'none', padding: '8px 16px', borderRadius: '8px',
          cursor: 'pointer', fontSize: '14px'
        }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
