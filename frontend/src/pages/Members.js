import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'https://library-management-by-arjun.onrender.com/api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', membershipStatus: 'active' });

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API}/members?search=${search}`);
      setMembers(res.data);
    } catch { toast.error('Failed to load members'); }
  };

  useEffect(() => { fetchMembers(); }, [search]);

  const openAdd = () => { setEditMember(null); setForm({ name: '', email: '', phone: '', address: '', membershipStatus: 'active' }); setShowModal(true); };
  const openEdit = (m) => { setEditMember(m); setForm({ name: m.name, email: m.email, phone: m.phone, address: m.address || '', membershipStatus: m.membershipStatus }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMember) {
        await axios.put(`${API}/members/${editMember._id}`, form);
        toast.success('Member updated!');
      } else {
        await axios.post(`${API}/members`, form);
        toast.success('Member added!');
      }
      setShowModal(false);
      fetchMembers();
    } catch (err) { toast.error(err.response?.data?.message || 'Error occurred'); }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await axios.delete(`${API}/members/${id}`);
      toast.success('Member deleted!');
      fetchMembers();
    } catch { toast.error('Delete failed'); }
  };

  const statusColor = { active: 'badge-success', expired: 'badge-warning', suspended: 'badge-danger' };

  return (
    <div>
      <div className="page-header">
        <h1>👥 Members</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input className="search-bar" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Member</button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Membership ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No members found</td></tr>
              ) : members.map(m => (
                <tr key={m._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{m.membershipId}</td>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td><span className={`badge ${statusColor[m.membershipStatus]}`}>{m.membershipStatus}</span></td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEdit(m)}>Edit</button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteMember(m._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editMember ? '✏️ Edit Member' : '➕ Add Member'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.membershipStatus} onChange={e => setForm({ ...form, membershipStatus: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editMember ? 'Update' : 'Add Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
