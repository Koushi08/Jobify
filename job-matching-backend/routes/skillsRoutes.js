const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get user skills
router.get('/skills', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user); // Get user ID from authMiddleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ skills: user.skills });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update user skills
router.put('/skills', authMiddleware, async (req, res) => {
  const { skills, expertise } = req.body;
  const userId = req.user;  // User ID from authMiddleware

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { skills, expertise },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Skills updated successfully', user });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ message: 'Error updating skills' });
  }
});

module.exports = router;
