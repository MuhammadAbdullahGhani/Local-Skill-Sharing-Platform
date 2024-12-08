const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/AnalyticalController');

// Routes for analytics data
router.get('/platform-usage', analyticsController.getPlatformUsage);
router.get('/popular-skills', analyticsController.getPopularSkills);
router.get('/instructor-earnings', analyticsController.getInstructorEarnings);

module.exports = router;
