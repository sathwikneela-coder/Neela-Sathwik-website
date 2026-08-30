const express = require('express');
const router = express.Router();
const { validateContactPayload } = require('../middleware/validation');
const { handleContactSubmission } = require('../controllers/contactController');

// POST /api/contact - Handle contact and quote submissions
router.post('/', validateContactPayload, handleContactSubmission);

module.exports = router;
