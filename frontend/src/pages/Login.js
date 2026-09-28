
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Login ho gaya!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ya password galat hai!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '48px',
        width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1a202c' }}>Library Management</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Sirf authorized users login kar sakte hain</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Email address likho"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Password likho"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '8px' }}>
            {loading ? 'Login ho raha hai...' : '🔑 Login Karo'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', borderRadius: '10px', fontSize: '13px', color: '#92400e', textAlign: 'center' }}>
          🔒 Account sirf Admin bana sakta hai
        </div>
      </div>
    </div>
  );
};

export default Login;