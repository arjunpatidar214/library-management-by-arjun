import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'https://library-management-by-arjun.onrender.com/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bookId: '', memberId: '', dueDate: '' });

  const fetchAll = async () => {
    try {
      const [t, b, m] = await Promise.all([
        axios.get(`${API}/transactions`),
        axios.get(`${API}/books`),
        axios.get(`${API}/members`)
      ]);
      setTransactions(t.data);
      setBooks(b.data.filter(bk => bk.availableCopies > 0));
      setMembers(m.data.filter(mb => mb.membershipStatus === 'active'));
    } catch { toast.error('Failed to load data'); }
  };

  useEffect(() => { fetchAll(); }, []);

  const issueBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/transactions/issue`, form);
      toast.success('Book issued successfully!');
      setShowModal(false);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Issue failed'); }
  };

  const returnBook = async (id) => {
    try {
      const res = await axios.put(`${API}/transactions/return/${id}`);
      toast.success(res.data.message);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Return failed'); }
  };

  const statusColor = { issued: 'badge-warning', returned: 'badge-success', overdue: 'badge-danger' };

  const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <h1>🔄 Transactions</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ bookId: '', memberId: '', dueDate: defaultDue }); setShowModal(true); }}>
          + Issue Book
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Return Date</th><th>Fine</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No transactions yet</td></tr>
              ) : transactions.map(t => (
                <tr key={t._id}>
                  <td><strong>{t.book?.title}</strong><br /><small style={{ color: '#6b7280' }}>{t.book?.author}</small></td>
                  <td>{t.member?.name}<br /><small style={{ color: '#6b7280' }}>{t.member?.membershipId}</small></td>
                  <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '—'}</td>
                  <td>{t.fine > 0 ? <span style={{ color: '#ef4444', fontWeight: '600' }}>₹{t.fine}</span> : '—'}</td>
                  <td><span className={`badge ${statusColor[t.status]}`}>{t.status}</span></td>
                  <td>
                    {t.status !== 'returned' && (
                      <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => returnBook(t._id)}>
                        Return
                      </button>
                    )}
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
            <h2>📖 Issue Book</h2>
            <form onSubmit={issueBook}>
              <div className="form-group">
                <label>Select Book *</label>
                <select value={form.bookId} onChange={e => setForm({ ...form, bookId: e.target.value })} required>
                  <option value="">Choose a book...</option>
                  {books.map(b => (
                    <option key={b._id} value={b._id}>{b.title} — {b.author} ({b.availableCopies} available)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Member *</label>
                <select value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} required>
                  <option value="">Choose a member...</option>
                  {members.map(m => (
                    <option key={m._id} value={m._id}>{m.name} — {m.membershipId}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Issue Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
