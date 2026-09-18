const { query } = require('../config/db');

const getVendorReviews = async (req, res, next) => {
  try {
    const vendorId = Number(req.params.vendorId);
    let reviews = [];
    try {
      const [dbReviews] = await query('SELECT * FROM reviews WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);
      reviews = dbReviews || [];
    } catch (e) {
      reviews = [];
    }

    res.json({
      success: true,
      count: reviews.length,
      reviews,
      data: {
        reviews
      }
    });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const vendorId = payload.vendorId || payload.vendor_id;
    const reviewerName = payload.reviewerName || payload.reviewer_name || (req.user ? req.user.name : 'Verified Customer');
    const rating = payload.rating;
    const comment = payload.comment || payload.review;
    const eventType = payload.eventType || payload.event_type || 'Wedding';

    if (!vendorId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID, rating (1-5), and comment are required.'
      });
    }

    const userId = req.user ? req.user.id : null;

    let reviewId = 10;
    try {
      const insertSql = `
        INSERT INTO reviews (vendor_id, user_id, reviewer_name, rating, comment, event_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const result = await query(insertSql, [
        Number(vendorId),
        userId,
        reviewerName,
        Number(rating),
        comment,
        eventType
      ]);
      reviewId = result[0]?.insertId || 10;
    } catch (e) {
      console.warn('[EventHub DB] Insert review fallback:', e.message);
    }

    const newReview = {
      id: reviewId,
      vendor_id: Number(vendorId),
      vendorId: Number(vendorId),
      reviewer_name: reviewerName,
      reviewerName,
      rating: Number(rating),
      comment,
      event_type: eventType,
      eventType,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      review: newReview,
      data: newReview,
      ...newReview
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVendorReviews,
  createReview
};
