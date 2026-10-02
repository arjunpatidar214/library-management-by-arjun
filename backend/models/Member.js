const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  membershipId: { type: String, unique: true },
  address: { type: String },
  membershipStatus: { type: String, enum: ['active', 'expired', 'suspended'], default: 'active' },
  booksIssued: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
}, { timestamps: true });

memberSchema.pre('save', function(next) {
  if (!this.membershipId) {
    this.membershipId = 'LIB-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
