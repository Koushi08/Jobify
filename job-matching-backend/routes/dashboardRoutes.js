const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Example endpoint to get dashboard data
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Example data to be shown on the dashboard
    const dashboardData = {
      name: `${user.firstName} ${user.lastName}`,
      skills: user.skills,
      experience: user.experience,
      projects: user.projects,
    };

    res.status(200).json({ message: 'Dashboard data fetched successfully', dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;
