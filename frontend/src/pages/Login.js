import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const API = 'https://library-management-by-arjun.onrender.com/api';

const Login = () => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Login ho gaya! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ya password galat hai!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Dono password match nahi kar rahe!');
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      });
      toast.success('Account ban gaya! Ab login karo 😊');
      setTab('login');
      setForm({ name: '', email: form.email, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '48px',
        width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>📚</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', margin: 0 }}>LibraryMS</h1>
          <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '14px' }}>Library Management System</p>
        </div>

        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setForm({ name: '', email: '', password: '', confirmPassword: '' }); }} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '9px', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#4f46e5' : '#6b7280',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
            }}>
              {t === 'login' ? '🔑 Login' : '✍️ Register'}
            </button>
          ))}
        </div>

        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#374151' }}>Email Address</label>
              <input style={inputStyle} type="email" placeholder="apna@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#374151' }}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', background: '#4f46e5',
              color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px',
              fontWeight: '600', cursor: 'pointer'
            }}>
              {loading ? 'Login ho raha hai...' : '🔑 Login '}
            </button>
            <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '10px', fontSize: '12px', color: '#0369a1', textAlign: 'center' }}>
              
            </div>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', fontSize: '12px', color: '#166534' }}>
        
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#374151' }}>Full Name</label>
              <input style={inputStyle} type="text" placeholder="Apna poora naam"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#374151' }}>Email Address</label>
              <input style={inputStyle} type="email" placeholder="apna@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#374151' }}>Password</label>
              <input style={inputStyle} type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#374151' }}>Confirm Password</label>
              <input style={inputStyle} type="password" placeholder="Password dobara likho"
                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', background: '#10b981',
              color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px',
              fontWeight: '600', cursor: 'pointer'
            }}>
              {loading ? 'Account ban raha hai...' : '✍️ CREATE ACCOUNT '}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;