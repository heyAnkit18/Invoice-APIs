const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unitPrice: Number,
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  customerDetails: {
    name: String,
    address: String,
    email: String,
    phone: String,
  },
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [itemSchema],
  taxRate: Number,
  totalAmount: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
});

module.exports = mongoose.model('Invoice', invoiceSchema);

