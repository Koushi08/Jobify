const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require('dotenv').config();
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./models/User');
const scrapeJobs = require('./scraping/scrapeJobs'); // Ensure scrapeJobs is defined
const streams = require('web-streams-polyfill');
const resumeRoutes = require('./routes/resumeRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Import and use routes
const profileRoutes = require('./routes/profileRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/user', profileRoutes);
app.use('/api/user', skillsRoutes); // Ensure this route is properly handled in skillsRoutes
app.use('/api/resume', resumeRoutes); // Ensure resumeRoutes is correctly implemented
app.use('/api/auth', authRoutes);  // For login and registration
app.use('/api', dashboardRoutes);  // For dashboard

// Job Recommendations API
app.get('/api/jobs/recommendations', async (req, res) => {
  const userSkills = Array.isArray(req.query.skills) ? req.query.skills : req.query.skills ? req.query.skills.split(',') : [];

  try {
    const jobRecommendations = await scrapeJobs(userSkills);
    res.json(jobRecommendations);
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    res.status(500).json({ message: 'Error fetching job recommendations' });
  }
});

// Get user profile
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user); // Use the user ID from authMiddleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile with name and location
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  const { name, location } = req.body;
  const userId = req.user;  // From authMiddleware

  try {
    await User.findByIdAndUpdate(userId, { name, location });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Update skills and expertise
app.put('/api/user/skills', authMiddleware, async (req, res) => {
  const { skills, expertise } = req.body;
  const userId = req.user;  // From authMiddleware

  try {
    const user = await User.findByIdAndUpdate(userId, { skills, expertise }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Skills updated successfully', user });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ message: 'Error updating skills' });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
