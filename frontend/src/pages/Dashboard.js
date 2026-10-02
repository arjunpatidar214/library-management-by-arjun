import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import LibrarianDashboard from '../components/LibrarianDashboard';
import MemberDashboard from '../components/MemberDashboard';
import { API } from '../config';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ books: 0, members: 0, issued: 0, overdue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, members, transactions] = await Promise.all([
          axios.get(`${API}/books`),
          axios.get(`${API}/members`),
          axios.get(`${API}/transactions`)
        ]);
        setStats({
          books: books.data.length,
          members: members.data.length,
          issued: transactions.data.filter(t => t.status === 'issued').length,
          overdue: transactions.data.filter(t => t.status === 'overdue').length
        });
      } catch (err) {}
    };
    if (user?.role !== 'member') fetchStats();
  }, [user]);

  if (user?.role === 'admin') return <AdminPanel stats={stats} />;
  if (user?.role === 'librarian') return <LibrarianDashboard stats={stats} />;
  return <MemberDashboard />;
};

export default Dashboard;