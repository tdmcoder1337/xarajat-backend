const mongoose = require('mongoose');

const essentialSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
});

module.exports = mongoose.model('EssentialExpense', essentialSchema);
