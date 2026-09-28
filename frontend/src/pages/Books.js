import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'https://library-management-by-arjun.onrender.com/api';
const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Children', 'Other'];

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', totalCopies: 1, description: '', publishedYear: '', publisher: '' });

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/books?search=${search}`);
      setBooks(res.data);
    } catch { toast.error('Failed to load books'); }
  };

  useEffect(() => { fetchBooks(); }, [search]);

  const openAdd = () => { setEditBook(null); setForm({ title: '', author: '', isbn: '', category: '', totalCopies: 1, description: '', publishedYear: '', publisher: '' }); setShowModal(true); };
  const openEdit = (book) => { setEditBook(book); setForm({ ...book }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBook) {
        await axios.put(`${API}/books/${editBook._id}`, form);
        toast.success('Book updated!');
      } else {
        await axios.post(`${API}/books`, form);
        toast.success('Book added!');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) { toast.error(err.response?.data?.message || 'Error occurred'); }
  };

  const deleteBook = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`${API}/books/${id}`);
      toast.success('Book deleted!');
      fetchBooks();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📚 Books</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input className="search-bar" placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Total</th><th>Available</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No books found</td></tr>
              ) : books.map(book => (
                <tr key={book._id}>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{book.isbn}</td>
                  <td><span className="badge badge-info">{book.category}</span></td>
                  <td>{book.totalCopies}</td>
                  <td>
                    <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {book.availableCopies}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEdit(book)}>Edit</button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteBook(book._id)}>Delete</button>
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
            <h2>{editBook ? '✏️ Edit Book' : '➕ Add New Book'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Author *</label>
                  <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ISBN *</label>
                  <input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Copies *</label>
                  <input type="number" min="1" value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: Number(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input value={form.publisher} onChange={e => setForm({ ...form, publisher: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editBook ? 'Update' : 'Add Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
