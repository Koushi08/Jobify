const User = require('../models/User');
const generatePDF = require('../utils/pdfGenerator');

exports.generateResume = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const pdfBuffer = await generatePDF(user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error generating resume' });
  }
};
