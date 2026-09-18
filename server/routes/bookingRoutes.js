const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => bookingController.createBooking(req, res, next));
  }
  return bookingController.createBooking(req, res, next);
});
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => bookingController.getUserBookings(req, res, next));
  }
  return bookingController.getUserBookings(req, res, next);
});
router.get('/my', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => bookingController.getUserBookings(req, res, next));
  }
  return bookingController.getUserBookings(req, res, next);
});
router.get('/vendor', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => bookingController.getVendorBookings(req, res, next));
  }
  return bookingController.getVendorBookings(req, res, next);
});
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => bookingController.updateBookingStatus(req, res, next));
  }
  return bookingController.updateBookingStatus(req, res, next);
});
router.post('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
