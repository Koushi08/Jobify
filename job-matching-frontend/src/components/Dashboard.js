import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [profileComplete, setProfileComplete] = useState(false);
  const [skillsComplete, setSkillsComplete] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [error, setError] = useState('');
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();

  const fetchJobRecommendations = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (skills) {
      try {
        const res = await axios.get('http://localhost:5001/api/jobs/recommendations', {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { skills },
        });
        setJobRecommendations(res.data);
      } catch (error) {
        console.error('Error fetching job recommendations:', error.response || error);
        if (error.response && error.response.status === 401) {
          handleTokenExpiration();
        }
      }
    }
  }, [skills]);

  useEffect(() => {
    fetchJobRecommendations();
  }, [fetchJobRecommendations]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      axios.get('http://localhost:5001/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .then((response) => {
        const { firstName, lastName, skills, profileComplete, skillsComplete } = response.data;
        setUsername(`${firstName} ${lastName}`);
        setSkills(skills);
        setProfileComplete(profileComplete);
        setSkillsComplete(skillsComplete);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error.response || error);
        if (error.response && error.response.status === 401) {
          handleTokenExpiration();
        } else {
          setError('Failed to fetch profile data');
        }
        setLoading(false);
      });
    } else {
      setError('No token found');
    }
  }, []);

  const handleTokenExpiration = () => {
    alert('Your session has expired. Please log in again.');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleProfileMenu = () => {
    setProfileMenuVisible(prevVisible => !prevVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleCreateResume = () => {
    navigate('/resume-generator');
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuVisible && !event.target.closest(".profile-settings") && !event.target.closest(".profile-menu")) {
        setProfileMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuVisible]);

  return (
    <div className="dashboard-container">
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      <header className="dashboard-header">
        <div className="header-content">
          <span className="project-name">AI-Powered Job Matching Platform</span>
          <div className="user-info-container">
            <span className="user-info">Hello,</span>
            <span className="user-info">{username}</span>
          </div>
          <div className="nav-options">
            <button onClick={handleCreateResume} aria-label="Create Resume or CV">Create Resume/CV</button>
            <button aria-label="View Job Cart">Job Cart</button>
          </div>
          <div
            className="profile-settings"
            onClick={toggleProfileMenu}
            aria-expanded={profileMenuVisible}
            aria-controls="profile-menu"
            role="button"
            tabIndex="0"
          >
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <div className={`profile-menu ${profileMenuVisible ? 'visible' : ''}`} id="profile-menu" role="menu">
          <ul>
            <li><a href="/profile-settings">Profile Settings</a></li>
            <li><a href="/skills-settings">Skill Settings</a></li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      </header>

      <div className="centered-message">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          !profileComplete || !skillsComplete ? (
            <p>Please complete your profile and skills to see job recommendations.</p>
          ) : (
            <div>
              <h2>Job Recommendations</h2>
              {jobRecommendations.length > 0 ? (
                <ul>
                  {jobRecommendations.map((job, index) => (
                    <li key={index}>
                      <h3>{job.title}</h3>
                      <p>{job.company}</p>
                      <p>{job.location}</p>
                      <p>Skills required: {job.skills}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No job recommendations available at this time.</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
