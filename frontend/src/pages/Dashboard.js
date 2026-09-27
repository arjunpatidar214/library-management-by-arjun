import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'white', borderRadius: '12px', padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '12px',
        background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c' }}>{value}</div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>{label}</div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, members: 0, issued: 0, overdue: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [books, members, transactions, overdue] = await Promise.all([
          axios.get(`${API}/books`),
          axios.get(`${API}/members`),
          axios.get(`${API}/transactions`),
          axios.get(`${API}/transactions/overdue`)
        ]);
        setStats({
          books: books.data.length,
          members: members.data.length,
          issued: transactions.data.filter(t => t.status === 'issued').length,
          overdue: overdue.data.length
        });
        setRecentTransactions(transactions.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>📊 Dashboard</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '28px' }}>
        <StatCard icon="📚" label="Total Books" value={stats.books} color="#dbeafe" />
        <StatCard icon="👥" label="Total Members" value={stats.members} color="#d1fae5" />
        <StatCard icon="🔄" label="Books Issued" value={stats.issued} color="#fef3c7" />
        <StatCard icon="⚠️" label="Overdue" value={stats.overdue} color="#fee2e2" />
      </div>

      <div className="card">
        <h2>📋 Recent Transactions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No transactions yet</td></tr>
              ) : recentTransactions.map(t => (
                <tr key={t._id}>
                  <td>{t.book?.title}</td>
                  <td>{t.member?.name}</td>
                  <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${t.status === 'returned' ? 'badge-success' : t.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
