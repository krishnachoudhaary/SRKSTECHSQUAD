const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', eventController.createEvent);
router.post('/smart-match', eventController.runSmartMatch);
router.get('/my-events', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => eventController.getUserEvents(req, res, next));
  }
  return eventController.getUserEvents(req, res, next);
});
router.get('/my', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => eventController.getUserEvents(req, res, next));
  }
  return eventController.getUserEvents(req, res, next);
});
router.post('/:id/replace-vendor', eventController.replaceEventVendor);
router.get('/:id', eventController.getEventById);
router.put('/:id/plan', eventController.updateEventPlanVendors);

module.exports = router;
