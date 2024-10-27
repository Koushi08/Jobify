const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    index: true // Indexed for faster queries
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    trim: true
  },
  mobileNumber: {
    type: String,
    trim: true,
    match: [/^\+?[0-9]{7,15}$/, 'Please enter a valid mobile number']
  },
  skills: {
    type: [String],
    default: []
  },
  education: [{
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    yearOfCompletion: { type: Number, min: 1900, max: new Date().getFullYear() }
  }],
  experience: {
    type: String,
    trim: true,
    default: ''
  },
  certifications: [{
    certificationName: { type: String, trim: true },
    issuingOrganization: { type: String, trim: true },
    issueDate: Date,
    expirationDate: Date
  }],
  projects: [{
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    technologiesUsed: { type: [String], default: [] },
    url: { type: String, trim: true, match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL'] }
  }],
  languages: {
    type: [String],
    default: []
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  jobs: [{
    jobTitle: { type: String, trim: true },
    responsibilities: { type: [String], default: [] }
  }],
  careerAchievements: {
    type: String,
    trim: true,
    default: ''
  },
  volunteerWork: [{
    role: { type: String, trim: true },
    organization: { type: String, trim: true },
    years: { type: Number, min: 0 },
    description: { type: String, trim: true }
  }],
  publications: [{
    title: { type: String, trim: true },
    journal: { type: String, trim: true },
    year: { type: Number, min: 1900, max: new Date().getFullYear() },
    url: { type: String, trim: true, match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL'] }
  }],
  professionalSummary: {
    type: String,
    trim: true,
    default: ''
  },
  portfolioUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL']
  }
}, {
  timestamps: true
});

// Pre-save hook for hashing passwords
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Full-text search index for searchable fields
UserSchema.index({ professionalSummary: 'text', skills: 'text', careerAchievements: 'text' });

module.exports = mongoose.model('User', UserSchema);
