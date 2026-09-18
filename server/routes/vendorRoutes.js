const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', vendorController.getAllVendors);
router.post('/compare', vendorController.compareVendors);
router.post('/profile', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => vendorController.updateVendorProfile(req, res, next));
  }
  return vendorController.updateVendorProfile(req, res, next);
});
router.get('/me', authMiddleware, vendorController.getVendorForCurrentUser);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => vendorController.updateVendorProfile(req, res, next));
  }
  return vendorController.updateVendorProfile(req, res, next);
});

module.exports = router;
