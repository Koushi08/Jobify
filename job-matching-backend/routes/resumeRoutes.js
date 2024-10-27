const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit'); // Optional: for generating a PDF resume

// POST /create - Create a resume based on provided data
router.post('/create', (req, res) => {
  const { skills, experience, education, certifications, projects, professionalSummary } = req.body;

  // Mock resume creation logic (expand as needed)
  const resume = {
    summary: professionalSummary || "Generated resume based on provided details.",
    skills,
    experience,
    education,
    certifications,
    projects
  };

  // Send response with resume data
  res.status(200).json({ message: 'Resume created successfully', resume });
});

// GET /download - Download resume as a PDF (mock example)
router.get('/download', (req, res) => {
  const doc = new PDFDocument();
  const filename = 'resume.pdf';

  // Set response headers to download PDF
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/pdf');

  // Generate PDF content based on mock data (expand as needed)
  doc.pipe(res);
  doc.fontSize(20).text('Resume', { align: 'center' });
  doc.fontSize(12).text(`Summary: ${req.query.summary || 'Your professional summary'}`);
  
  doc.moveDown().fontSize(16).text('Skills');
  (req.query.skills || []).forEach(skill => doc.fontSize(12).text(`- ${skill}`));

  doc.moveDown().fontSize(16).text('Experience');
  (req.query.experience || []).forEach(exp => doc.fontSize(12).text(`- ${exp}`));

  doc.moveDown().fontSize(16).text('Education');
  (req.query.education || []).forEach(edu => doc.fontSize(12).text(`- ${edu.degree} at ${edu.institution} (${edu.yearOfCompletion})`));

  doc.end();
});

module.exports = router;
