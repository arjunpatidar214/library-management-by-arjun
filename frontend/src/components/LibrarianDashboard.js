import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '26px', fontWeight: '700' }}>{value}</div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>{label}</div>
      </div>
    </div>
  </div>
);

const LibrarianDashboard = ({ stats }) => {
  const quickActions = [
    { icon: '📚', label: 'Books Manage Karo', desc: 'Add, edit, delete books', link: '/books', color: '#dbeafe' },
    { icon: '👥', label: 'Members Manage Karo', desc: 'Members add, edit karo', link: '/members', color: '#d1fae5' },
    { icon: '🔄', label: 'Book Issue/Return', desc: 'Books issue aur return karo', link: '/transactions', color: '#fef3c7' },
  ];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)', borderRadius: '16px', padding: '28px', marginBottom: '24px', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700' }}>📋 Librarian Dashboard</h1>
        <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: '14px' }}>Library manage karo efficiently</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard icon="📚" label="Total Books" value={stats.books} color="#dbeafe" />
        <StatCard icon="👥" label="Total Members" value={stats.members} color="#d1fae5" />
        <StatCard icon="🔄" label="Books Issued" value={stats.issued} color="#fef3c7" />
        <StatCard icon="⚠️" label="Overdue" value={stats.overdue} color="#fee2e2" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {quickActions.map(action => (
          <Link key={action.link} to={action.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '14px' }}>{action.icon}</div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a202c', marginBottom: '4px' }}>{action.label}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LibrarianDashboard;
