const express = require('express');
const Invoice = require('../models/invoice');
const auth = require('../middlewares/auth');
const role = require('../middlewares/roles');

const router = express.Router();


router.post('/', [auth, role('admin')], async (req, res) => {
  const {
    invoiceNumber,
    customerDetails,
    invoiceDate,
    dueDate,
    items,
    taxRate,
    discount,
    paymentStatus,
  } = req.body;

  let itemTotal = 0;
  items.forEach(item => (itemTotal += item.quantity * item.unitPrice));

  const taxAmount = (itemTotal * taxRate) / 100;
  const totalAmount = itemTotal + taxAmount - discount;

  const generatedInvoiceNumber = invoiceNumber || `INV-${Date.now()}`;

  const invoice = new Invoice({
    invoiceNumber: generatedInvoiceNumber,
    customerDetails,
    invoiceDate,
    dueDate,
    items,
    taxRate,
    discount,
    totalAmount,
    paymentStatus,
    createdBy: req.user.id,
  });

  await invoice.save();
  res.status(201).json({ message: 'Invoice created successfully', invoice });
});

router.get('/', auth, async (req, res) => {
  let invoices;
  if (req.user.role === 'admin') {
    invoices = await Invoice.find();
  } else {
    invoices = await Invoice.find({ createdBy: req.user.id });
  }
  res.json(invoices);
});

router.get('/:id', auth, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) return res.status(404).send('Invoice not found');
  if (req.user.role !== 'admin' && invoice.createdBy.toString() !== req.user.id) {
    return res.status(403).send('Access Denied');
  }

  res.json(invoice);
});

router.put('/:id', [auth, role('admin')], async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!invoice) return res.status(404).send('Invoice not found');
  res.json({ message: 'Invoice updated successfully', invoice });
});

router.delete('/:id', [auth, role('admin')], async (req, res) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  if (!invoice) return res.status(404).send('Invoice not found');
  res.json({ message: 'Invoice deleted successfully' });
});

module.exports = router;


