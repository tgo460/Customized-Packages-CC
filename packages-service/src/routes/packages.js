const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Create a new package
router.post('/', packageController.createPackage);

// Get all packages
router.get('/', packageController.getAllPackages);

// Search packages
router.post('/search', packageController.searchPackages);

// Book a package
router.post('/book', packageController.bookPackage);

// Get package details by ID
router.get('/:id', packageController.getPackageById);

module.exports = router; 