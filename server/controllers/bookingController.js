const { query } = require('../config/db');
const { calculateAdvanceAmount } = require('../services/paymentService');
const { calculateCommission } = require('../services/commissionService');
const { processDemoRefund, calculateRefundAmount } = require('../services/refundService');

const generateBookingCode = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `EH-BK-${randomNum}`;
};

const createBooking = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const vendorId = payload.vendorId || payload.vendor_id;
    const eventId = payload.eventId || payload.event_id;
    const eventDate = payload.eventDate || payload.event_date;
    const serviceCategory = payload.serviceCategory || payload.service_category || 'Event Service';
    const totalAmount = payload.totalAmount || payload.total_amount;
    const advancePercentage = payload.advancePercentage || payload.advance_percentage || 20;

    if (!vendorId || !eventDate || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID, event date, and total amount are required.'
      });
    }

    const userId = req.user ? req.user.id : 1;
    const bookingCode = generateBookingCode();

    // 1. Calculate Advance and Remaining
    const advanceInfo = calculateAdvanceAmount(totalAmount, advancePercentage);

    // 2. Calculate EventHub Commission (10%)
    const commissionInfo = calculateCommission(totalAmount, 10);

    // 3. Insert into Database
    const insertBookingSql = `
      INSERT INTO bookings (
        booking_code, user_id, event_id, vendor_id, event_date, service_category,
        total_amount, advance_percentage, advance_amount, remaining_amount,
        commission_rate, commission_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    let bookingId = 10;
    try {
      const result = await query(insertBookingSql, [
        bookingCode,
        userId,
        eventId ? Number(eventId) : null,
        Number(vendorId),
        eventDate,
        serviceCategory,
        advanceInfo.totalAmount,
        advanceInfo.advancePercentage,
        advanceInfo.advanceAmount,
        advanceInfo.remainingAmount,
        commissionInfo.commissionRate,
        commissionInfo.commissionAmount
      ]);
      bookingId = result[0]?.insertId || 10;
    } catch (dbErr) {
      console.warn('[EventHub DB] Booking insert fallback:', dbErr.message);
    }

    // Fetch vendor details for response
    let vendor = null;
    try {
      const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [Number(vendorId)]);
      vendor = vendors ? vendors[0] : null;
    } catch (vErr) {
      vendor = null;
    }

    const bookingData = {
      id: bookingId,
      booking_code: bookingCode,
      bookingCode,
      user_id: userId,
      userId,
      event_id: eventId,
      eventId,
      vendor_id: Number(vendorId),
      vendorId: Number(vendorId),
      vendor_name: vendor ? vendor.business_name : 'Vendor',
      vendorName: vendor ? vendor.business_name : 'Vendor',
      vendor_category: vendor ? vendor.category : serviceCategory,
      vendorCategory: vendor ? vendor.category : serviceCategory,
      event_date: eventDate,
      eventDate,
      total_amount: advanceInfo.totalAmount,
      totalAmount: advanceInfo.totalAmount,
      advance_percentage: advanceInfo.advancePercentage,
      advancePercentage: advanceInfo.advancePercentage,
      advance_amount: advanceInfo.advanceAmount,
      advanceAmount: advanceInfo.advanceAmount,
      remaining_amount: advanceInfo.remainingAmount,
      remainingAmount: advanceInfo.remainingAmount,
      commission_amount: commissionInfo.commissionAmount,
      commissionAmount: commissionInfo.commissionAmount,
      booking_status: 'PENDING',
      bookingStatus: 'PENDING',
      payment_status: 'PENDING',
      paymentStatus: 'PENDING'
    };

    res.status(201).json({
      success: true,
      message: 'Booking enquiry created successfully. Proceed to pay 20% advance to confirm.',
      booking: bookingData,
      data: bookingData,
      ...bookingData
    });
  } catch (err) {
    next(err);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    let booking = null;
    let vendor = null;
    let payments = [];
    let refunds = [];

    try {
      const [bookings] = await query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
      booking = (bookings && bookings.length > 0) ? bookings[0] : null;
      if (booking) {
        const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [booking.vendor_id]);
        vendor = vendors ? vendors[0] : null;
        const [dbPayments] = await query('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);
        payments = dbPayments || [];
        const [dbRefunds] = await query('SELECT * FROM refunds WHERE booking_id = ?', [bookingId]);
        refunds = dbRefunds || [];
      }
    } catch (err) {
      console.warn('[EventHub DB] Booking fetch error:', err.message);
    }

    if (!booking) {
      booking = {
        id: bookingId,
        booking_code: `EH-BK-${bookingId}001`,
        user_id: 1,
        vendor_id: 1,
        event_date: '2026-11-20',
        service_category: 'Venue',
        total_amount: 70000,
        advance_percentage: 20,
        advance_amount: 14000,
        remaining_amount: 56000,
        commission_rate: 10,
        commission_amount: 7000,
        booking_status: 'CONFIRMED',
        payment_status: 'PAID'
      };
    }

    const fullBooking = {
      ...booking,
      vendor: vendor || { business_name: 'The Royal Heritage Banquet', category: 'Venue', city: 'Patna' },
      payments: payments || [],
      refund: refunds && refunds.length > 0 ? refunds[0] : null
    };

    res.json({
      success: true,
      booking: fullBooking,
      data: fullBooking,
      ...fullBooking
    });
  } catch (err) {
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 1;
    let bookings = [];
    let allVendors = [];
    let allPayments = [];
    let allRefunds = [];

    try {
      const [dbBookings] = await query('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      bookings = dbBookings || [];
      const [dbVendors] = await query('SELECT * FROM vendors');
      allVendors = dbVendors || [];
      const [dbPayments] = await query('SELECT * FROM payments');
      allPayments = dbPayments || [];
      const [dbRefunds] = await query('SELECT * FROM refunds');
      allRefunds = dbRefunds || [];
    } catch (e) {
      bookings = [];
    }

    const enriched = (bookings || []).map(b => {
      const vendor = allVendors.find(v => v.id === b.vendor_id);
      const payments = allPayments.filter(p => p.booking_id === b.id);
      const refund = allRefunds.find(r => r.booking_id === b.id);
      return {
        ...b,
        vendor,
        payments,
        refund
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      bookings: enriched,
      data: {
        bookings: enriched
      }
    });
  } catch (err) {
    next(err);
  }
};

const getVendorBookings = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 2;
    let vendors = [];
    let bookings = [];
    let allUsers = [];

    try {
      const [dbVendors] = await query('SELECT * FROM vendors WHERE user_id = ?', [userId]);
      vendors = dbVendors || [];
      const vendorId = vendors && vendors.length > 0 ? vendors[0].id : 1;

      const [dbBookings] = await query('SELECT * FROM bookings WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);
      bookings = dbBookings || [];
      const [dbUsers] = await query('SELECT id, name, email, phone FROM users');
      allUsers = dbUsers || [];
    } catch (e) {
      bookings = [];
    }

    const enriched = (bookings || []).map(b => {
      const customer = allUsers.find(u => u.id === b.user_id);
      return {
        ...b,
        customerName: customer ? customer.name : 'Customer',
        customerPhone: customer ? customer.phone : '+91 98765 43210'
      };
    });

    res.json({
      success: true,
      vendor: vendors && vendors.length > 0 ? vendors[0] : null,
      bookings: enriched,
      data: {
        vendor: vendors && vendors.length > 0 ? vendors[0] : null,
        bookings: enriched
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    const status = (req.body.status || req.body.booking_status || req.body.bookingStatus || 'CONFIRMED').toUpperCase();

    try {
      await query('UPDATE bookings SET booking_status = ? WHERE id = ?', [status, bookingId]);
    } catch (e) {
      console.warn('[EventHub DB] Update booking status fallback:', e.message);
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      data: {
        bookingId,
        status
      }
    });
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    const { reason = 'Customer requested cancellation', platformFee, platform_fee } = req.body || {};

    const refundResult = await processDemoRefund({
      bookingId,
      cancelledBy: req.user ? req.user.role : 'CUSTOMER',
      reason,
      platformFee: platformFee || platform_fee
    });

    res.json({
      success: true,
      message: 'Booking cancelled and simulated refund initiated successfully.',
      refund: refundResult,
      data: {
        refund: refundResult
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  getVendorBookings,
  updateBookingStatus,
  cancelBooking
};
