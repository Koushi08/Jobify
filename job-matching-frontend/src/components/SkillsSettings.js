import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SkillsSettings.css';
import NotFound from './NotFound';
import ProtectedRoute from './ProtectedRoute';


const SkillsSettings = () => {
  const [userData, setUserData] = useState({
    skills: [],
    education: [{ degree: '', institution: '', yearOfCompletion: '' }],
    experience: '',
    certifications: [{ certificationName: '', issuingOrganization: '', issueDate: '', expirationDate: '' }],
    projects: [{ title: '', description: '', technologiesUsed: [], url: '' }],
    languages: [],
    yearsOfExperience: '',
    jobs: [{ jobTitle: '', responsibilities: [] }],
    careerAchievements: '',
    volunteerWork: [{ role: '', organization: '', years: 0, description: '' }],
    publications: [{ title: '', journal: '', year: 0, url: '' }],
    professionalSummary: '',
    portfolioUrl: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [missingSkillsWarning, setMissingSkillsWarning] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5001/api/user/skills', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user skills', error);
      });
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5001/api/user/update-skills',
        userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user skills', error);
    }
  };

  const handleFieldChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleArrayChange = (arrayField, index, subField, value) => {
    const updatedArray = [...userData[arrayField]];
    updatedArray[index][subField] = value;
    setUserData({ ...userData, [arrayField]: updatedArray });
  };

  const handleAddToArray = (arrayField, newItem) => {
    setUserData({ ...userData, [arrayField]: [...userData[arrayField], newItem] });
  };

  const handleRemoveFromArray = (arrayField, index) => {
    const updatedArray = [...userData[arrayField]];
    updatedArray.splice(index, 1);
    setUserData({ ...userData, [arrayField]: updatedArray });
  };

  const handleGenerateResume = () => {
    if (userData.skills.length === 0) {
      setMissingSkillsWarning(true);
      setResumeGenerated(false);
    } else {
      setMissingSkillsWarning(false);
      setResumeGenerated(true);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="skills-settings-container">
      <h1>Skills & Resume Settings</h1>
      
      <button onClick={toggleEdit} className="edit-btn">
        {isEditing ? 'Save Changes' : 'Edit'}
      </button>

      {/* Skills Section */}
      <section>
        <h2>Skills</h2>
        <div>
          {userData.skills.map((skill, index) => (
            <div key={index} className="skill-field">
              <span>{skill}</span>
              {isEditing && (
                <button onClick={() => handleRemoveFromArray('skills', index)}>Remove</button>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="add-skill-field">
            <input
              type="text"
              placeholder="Add new skill"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
            />
            <button onClick={() => {
              handleAddToArray('skills', newSkill);
              setNewSkill('');
            }}>Add Skill</button>
          </div>
        )}
      </section>

      {/* Professional Summary */}
      <section>
        <h2>Professional Summary</h2>
        <textarea
          value={userData.professionalSummary}
          onChange={e => handleFieldChange('professionalSummary', e.target.value)}
          placeholder="Brief summary of your professional experience"
          disabled={!isEditing}
        />
      </section>

      {/* Education Section */}
      <section>
        <h2>Education</h2>
        {userData.education.map((edu, index) => (
          <div key={index} className="resume-field">
            <input
              type="text"
              value={edu.degree}
              onChange={e => handleArrayChange('education', index, 'degree', e.target.value)}
              placeholder="Degree"
              disabled={!isEditing}
            />
            <input
              type="text"
              value={edu.institution}
              onChange={e => handleArrayChange('education', index, 'institution', e.target.value)}
              placeholder="Institution"
              disabled={!isEditing}
            />
            <input
              type="number"
              value={edu.yearOfCompletion}
              onChange={e => handleArrayChange('education', index, 'yearOfCompletion', e.target.value)}
              placeholder="Year of Completion"
              disabled={!isEditing}
            />
            {isEditing && (
              <button onClick={() => handleRemoveFromArray('education', index)}>Remove</button>
            )}
          </div>
        ))}
        {isEditing && (
          <button onClick={() => handleAddToArray('education', { degree: '', institution: '', yearOfCompletion: '' })}>
            Add Education
          </button>
        )}
      </section>

      {/* Certifications Section */}
      <section>
        <h2>Certifications</h2>
        {userData.certifications.map((cert, index) => (
          <div key={index} className="resume-field">
            <input
              type="text"
              value={cert.certificationName}
              onChange={e => handleArrayChange('certifications', index, 'certificationName', e.target.value)}
              placeholder="Certification Name"
              disabled={!isEditing}
            />
            <input
              type="text"
              value={cert.issuingOrganization}
              onChange={e => handleArrayChange('certifications', index, 'issuingOrganization', e.target.value)}
              placeholder="Issuing Organization"
              disabled={!isEditing}
            />
            <input
              type="date"
              value={cert.issueDate}
              onChange={e => handleArrayChange('certifications', index, 'issueDate', e.target.value)}
              placeholder="Issue Date"
              disabled={!isEditing}
            />
            <input
              type="date"
              value={cert.expirationDate}
              onChange={e => handleArrayChange('certifications', index, 'expirationDate', e.target.value)}
              placeholder="Expiration Date"
              disabled={!isEditing}
            />
            {isEditing && (
              <button onClick={() => handleRemoveFromArray('certifications', index)}>Remove</button>
            )}
          </div>
        ))}
        {isEditing && (
          <button onClick={() => handleAddToArray('certifications', { certificationName: '', issuingOrganization: '', issueDate: '', expirationDate: '' })}>
            Add Certification
          </button>
        )}
      </section>

      <button onClick={handleGenerateResume} className="generate-resume-btn">
        Generate Resume
      </button>

      {missingSkillsWarning && (
        <div className="missing-skills-warning">
          <p>Please update your skills to generate your resume.</p>
        </div>
      )}

      {resumeGenerated && (
        <div className="resume-content">
          <h2>Your Generated Resume</h2>
          <h3>Professional Summary</h3>
          <p>{userData.professionalSummary}</p>

          <h3>Skills</h3>
          <ul>
            {userData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3>Education</h3>
          {userData.education.map((edu, index) => (
            <p key={index}>
              {edu.degree} - {edu.institution} ({edu.yearOfCompletion})
            </p>
          ))}

          {/* Additional sections for experience, certifications, projects, etc. */}
        </div>
      )}
    </div>
  );
};

export default SkillsSettings;
