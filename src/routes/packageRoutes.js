const express = require('express');
const { body, validationResult } = require('express-validator');
const packageController = require('../controllers/packageController');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validatePackageSearch = [
  body('source').notEmpty().withMessage('Source is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('departureDate').isISO8601().withMessage('Invalid departure date'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('preferences.flightClass').optional().isIn(['economy', 'business', 'first']),
  body('preferences.hotelRating').optional().isInt({ min: 1, max: 5 }),
  body('preferences.busType').optional().isIn(['AC', 'Non-AC'])
];

// Routes
router.post('/search', validatePackageSearch, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const packages = await packageController.searchPackages(req.body);
    res.json({ packages });
  } catch (error) {
    logger.error('Error in package search:', error);
    res.status(500).json({ error: 'Failed to search packages' });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({ error: 'Package ID is required' });
    }

    const booking = await packageController.bookPackage(packageId);
    res.json(booking);
  } catch (error) {
    logger.error('Error in package booking:', error);
    res.status(500).json({ error: 'Failed to book package' });
  }
});

module.exports = router; 