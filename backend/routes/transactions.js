const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');
const { auth } = require('../middleware/auth');

// GET all transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book', 'title author isbn')
      .populate('member', 'name email membershipId')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST issue book
router.post('/issue', auth, async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (member.membershipStatus !== 'active') return res.status(400).json({ message: 'Member not active' });

    const transaction = new Transaction({
      book: bookId,
      member: memberId,
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      issuedBy: req.user._id,
      status: 'issued'
    });

    await transaction.save();
    book.availableCopies -= 1;
    await book.save();
    member.booksIssued.push(transaction._id);
    await member.save();

    await transaction.populate(['book', 'member', 'issuedBy']);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT return book
router.put('/return/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    const returnDate = new Date();
    let fine = 0;
    if (returnDate > transaction.dueDate) {
      const daysLate = Math.ceil((returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 5; // Rs. 5 per day fine
    }

    transaction.returnDate = returnDate;
    transaction.status = 'returned';
    transaction.fine = fine;
    await transaction.save();

    const book = await Book.findById(transaction.book);
    book.availableCopies += 1;
    await book.save();

    await transaction.populate(['book', 'member']);
    res.json({ transaction, fine, message: fine > 0 ? `Book returned with fine of Rs. ${fine}` : 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET overdue books
router.get('/overdue', auth, async (req, res) => {
  try {
    const overdue = await Transaction.find({
      status: 'issued',
      dueDate: { $lt: new Date() }
    }).populate('book', 'title author').populate('member', 'name email phone');

    await Transaction.updateMany({ status: 'issued', dueDate: { $lt: new Date() } }, { status: 'overdue' });
    res.json(overdue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
