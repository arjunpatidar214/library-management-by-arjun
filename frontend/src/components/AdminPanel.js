import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'https://library-management-by-arjun.onrender.com/api';

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

const AdminPanel = ({ stats }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/auth/users`);
      setUsers(res.data);
    } catch {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const createLibrarian = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/create-librarian`, form);
      toast.success('Librarian account created successfully');
      setShowModal(false);
      setForm({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error hua');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Is user ko delete karo?')) return;
    try {
      await axios.delete(`${API}/auth/users/${id}`);
      toast.success('User delete ho gaya');
      fetchUsers();
    } catch { toast.error('Delete nahi hua'); }
  };

  const roleColor = { admin: '#7c3aed', librarian: '#0891b2', member: '#059669' };
  const roleBg = { admin: '#f3e8ff', librarian: '#e0f2fe', member: '#d1fae5' };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '16px', padding: '28px', marginBottom: '24px', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700' }}>👑 Admin Dashboard</h1>
        <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: '14px' }}>Pura system aapke control mein hai</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard icon="📚" label="Total Books" value={stats.books} color="#dbeafe" />
        <StatCard icon="👥" label="Total Members" value={stats.members} color="#d1fae5" />
        <StatCard icon="🔄" label="Books Issued" value={stats.issued} color="#fef3c7" />
        <StatCard icon="⚠️" label="Overdue" value={stats.overdue} color="#fee2e2" />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['overview', 'users'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', fontSize: '14px',
            background: activeTab === t ? '#4f46e5' : 'white',
            color: activeTab === t ? 'white' : '#6b7280',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {t === 'overview' ? '📊 Overview' : '👥 Users Manage'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>📋 System Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { icon: '👑', role: 'Admin', count: users.filter(u => u.role === 'admin').length, desc: 'System ke malik' },
              { icon: '📋', role: 'Librarian', count: users.filter(u => u.role === 'librarian').length, desc: 'Books manage karte hain' },
              { icon: '👤', role: 'Member', count: users.filter(u => u.role === 'member').length, desc: 'Library members' },
              { icon: '📚', role: 'Total Books', count: stats.books, desc: 'Library mein books' },
            ].map(item => (
              <div key={item.role} style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '20px' }}>{item.count}</div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.role}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>👥 Sab Users</h2>
            <button onClick={() => setShowModal(true)} style={{
              padding: '10px 20px', background: '#4f46e5', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
            }}>+ Librarian Banao</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Naam', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ padding: '12px 14px', fontWeight: '600' }}>{u.name}</td>
                  <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: '14px' }}>{u.email}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: roleBg[u.role], color: roleColor[u.role] }}>
                      {u.role === 'admin' ? '👑 Admin' : u.role === 'librarian' ? '📋 Librarian' : '👤 Member'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 14px' }}>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u._id)} style={{ padding: '5px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '420px' }}>
            <h2 style={{ marginTop: 0 }}>📋 Naya Librarian Banao</h2>
            <form onSubmit={createLibrarian}>
              {['name', 'email', 'password'].map(field => (
                <div key={field} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                    {field === 'name' ? 'Full Name' : field === 'email' ? 'Email' : 'Password'}
                  </label>
                  <input type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                    value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Banao</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
