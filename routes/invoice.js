const express = require('express');
const Invoice = require('../models/invoice');
const auth = require('../middlewares/auth');
const role = require('../middlewares/roles');

const router = express.Router();

// Create an Invoice (Admin Only)
router.post('/', [auth, role('admin')], async (req, res) => {
  try {
    const {
      invoiceNumber,
      customerDetails,
      invoiceDate,
      dueDate,
      items,
      taxRate,
      paymentStatus,
    } = req.body;

    // Calculate total amount
    let itemTotal = 0;
    items.forEach(item => {
      itemTotal += item.quantity * item.unitPrice;
    });
    const taxAmount = (itemTotal * taxRate) / 100;
    const totalAmount = itemTotal + taxAmount;

    // Generate invoice number if not provided
    const generatedInvoiceNumber = invoiceNumber || `INV-${Date.now()}`;

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber: generatedInvoiceNumber,
      customerDetails,
      invoiceDate,
      dueDate,
      items,
      taxRate,
      totalAmount,
      paymentStatus,
    });

    // Save to database
    await invoice.save();

    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Get All Invoices
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.send(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get Invoice by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.send(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Update an Invoice (Admin Only)
router.put('/:id', [auth, role('admin')], async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice updated successfully', invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete an Invoice (Admin Only)
router.delete('/:id', [auth, role('admin')], async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

module.exports = router;

