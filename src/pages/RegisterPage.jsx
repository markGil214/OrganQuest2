import React, { useState } from 'react';
import AvatarSelector from '../components/AvatarSelector';
import './RegisterPage.css';

const RegisterPage = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    avatar: null,
    language: 'english'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Registration Data:', formData);
    
    // Navigate to welcome screen with user data
    if (onRegistrationComplete) {
      onRegistrationComplete(formData);
    } else {
      // Fallback if prop not provided
      alert(`Welcome, ${formData.username}! Registration data logged to console.`);
    }
  };

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'filipino', label: 'Filipino' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'mandarin', label: 'Mandarin' }
  ];

  return (
    <div className="register-page">
      <div className="register-card">
        <form onSubmit={handleSubmit} className="register-form">
          {/* Profile Picture Placeholder */}
          <div className="profile-picture-placeholder">
            <div className="circle-placeholder">
              {formData.avatar ? (
                <img 
                  src={`/avatars/avatar-${formData.avatar}.svg`} 
                  alt="Selected avatar"
                  className="selected-avatar-preview"
                />
              ) : (
                <div className="placeholder-icon">👤</div>
              )}
            </div>
          </div>

          <h2 className="register-title">Welcome!</h2>

          {/* Username Input */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Enter your username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="form-input"
              required
            />
          </div>

          {/* Age Input */}
          <div className="form-group">
            <label htmlFor="age" className="form-label">
              Enter your age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Age"
              className="form-input"
              min="1"
              max="120"
              required
            />
          </div>

          {/* Avatar Selection */}
          <div className="form-group">
            <label className="form-label">Select your avatar:</label>
            <AvatarSelector
              selectedAvatar={formData.avatar}
              onAvatarSelect={handleAvatarSelect}
            />
          </div>

          {/* Language Selector */}
          <div className="form-group">
            <label htmlFor="language" className="form-label">
              Select language:
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Register Button */}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
