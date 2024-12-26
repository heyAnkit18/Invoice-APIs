const express = require('express');
const Invoice = require('../models/invoice');
const auth = require('../middlewares/auth');
const role = require('../middlewares/roles');

const router = express.Router();

router.post('/', [auth, role('admin')], async (req, res) => {
  const invoice = new Invoice(req.body);
  await invoice.save();
  res.send(invoice);
});

router.get('/', auth, async (req, res) => {
  const invoices = await Invoice.find();
  res.send(invoices);
});

router.get('/:id', auth, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).send('Invoice not found');
  res.send(invoice);
});

router.put('/:id', [auth, role('admin')], async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(invoice);
});

router.delete('/:id', [auth, role('admin')], async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.send('Invoice deleted');
});

module.exports = router;
