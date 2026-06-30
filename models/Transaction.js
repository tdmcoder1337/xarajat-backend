const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  date: { type: String, required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
});

module.exports = mongoose.model('Transaction', transactionSchema);
