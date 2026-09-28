import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://library-management-by-arjun.onrender.com/api';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, transRes] = await Promise.all([
          axios.get(`${API}/books`),
          axios.get(`${API}/transactions`)
        ]);
        setBooks(booksRes.data);
        const myTrans = transRes.data.filter(t => t.member?.email === user?.email);
        setMyTransactions(myTrans);
      } catch {}
    };
    fetchData();
  }, [user]);

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: '16px', padding: '28px', marginBottom: '24px', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700' }}>👋 Welcome, {user?.name}!</h1>
        <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: '14px' }}>Library mein aapka swagat hai</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, fontSize: '18px' }}>📖 Meri Issued Books ({myTransactions.filter(t => t.status !== 'returned').length})</h2>
        {myTransactions.filter(t => t.status !== 'returned').length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>Abhi koi book issue nahi hai</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {myTransactions.filter(t => t.status !== 'returned').map(t => (
              <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f9fafb', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{t.book?.title}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{t.book?.author}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Due: {new Date(t.dueDate).toLocaleDateString()}</div>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: t.status === 'overdue' ? '#fee2e2' : '#fef3c7', color: t.status === 'overdue' ? '#dc2626' : '#92400e' }}>
                    {t.status === 'overdue' ? '⚠️ Overdue' : '🔄 Issued'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>📚 Available Books</h2>
          <input placeholder="🔍 Book search karo..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', width: '250px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {filteredBooks.slice(0, 12).map(book => (
            <div key={book._id} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📕</div>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#1a202c' }}>{book.title}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{book.author}</div>
              <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: book.availableCopies > 0 ? '#d1fae5' : '#fee2e2', color: book.availableCopies > 0 ? '#065f46' : '#991b1b' }}>
                {book.availableCopies > 0 ? `✅ ${book.availableCopies} Available` : '❌ Not Available'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
