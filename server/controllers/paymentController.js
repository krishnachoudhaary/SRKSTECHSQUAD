const { query } = require('../config/db');
const { processDemoPayment } = require('../services/paymentService');

const processPayment = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const bookingId = payload.bookingId || payload.booking_id;
    const amount = payload.amount;
    const paymentMethod = payload.paymentMethod || payload.payment_method || 'UPI (Simulated)';
    const paymentType = payload.paymentType || payload.payment_type || 'ADVANCE';
    const notes = payload.notes;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and payment amount are required.'
      });
    }

    let booking = null;
    try {
      const [bookings] = await query('SELECT * FROM bookings WHERE id = ?', [Number(bookingId)]);
      booking = (bookings && bookings.length > 0) ? bookings[0] : null;
    } catch (e) {
      console.warn('[EventHub DB] Booking query fallback in payment:', e.message);
    }

    const paymentResult = await processDemoPayment({
      bookingId: Number(bookingId),
      amount: Number(amount),
      paymentMethod,
      paymentType,
      notes: notes || `Simulated ${paymentType} payment via ${paymentMethod}`
    });

    const normalizedPayment = {
      ...paymentResult,
      transaction_reference: paymentResult.transactionReference || paymentResult.transaction_reference,
      transactionReference: paymentResult.transactionReference || paymentResult.transaction_reference
    };

    res.status(200).json({
      success: true,
      message: 'Payment simulation successful. Booking confirmed!',
      payment: normalizedPayment,
      data: normalizedPayment,
      ...normalizedPayment
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentByBookingId = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.bookingId);
    let payments = [];
    try {
      const [dbPayments] = await query('SELECT * FROM payments WHERE booking_id = ? ORDER BY payment_date DESC', [bookingId]);
      payments = dbPayments || [];
    } catch (e) {
      payments = [];
    }

    res.json({
      success: true,
      count: payments.length,
      payments,
      data: {
        payments
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  processPayment,
  getPaymentByBookingId
};
