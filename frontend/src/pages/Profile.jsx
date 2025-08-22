import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getProfile, changeName, changeEmail, changePassword } from '../services/api';
import EnhancedNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Profile.css';


const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        setProfileData(response.data);
        setNewName(response.data.name || '');
        setNewEmail(response.data.email || '');
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleNameChange = async (e) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await changeName({ newName });
      
      // Update local state and context
      setProfileData({ ...profileData, name: newName });
      login({ ...user, name: newName });
      
      setSuccess('Name updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update name');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      setError('Email cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await changeEmail({ newEmail });
      
      // Update local state and context
      setProfileData({ ...profileData, email: newEmail });
      login({ ...user, email: newEmail });
      
      setSuccess('Email updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await changePassword({
        currentPassword,
        newPassword
      });
      
      setSuccess('Password updated successfully');
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading && !profileData) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
        <EnhancedNavbar 
          onLogout={handleLogout} 
          userName={user?.name}
        />
        <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
          <div className="loading-container">Loading profile...</div>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      <EnhancedNavbar 
        onLogout={handleLogout} 
        userName={profileData?.name || user?.name}
      />
      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <div className="profile-container">
          <h1 className="profile-header">Profile Settings</h1>
          
          {error && (
            <div className="profile-alert error" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="profile-alert success" role="alert">
              <p>{success}</p>
            </div>
          )}
          
          <div className="profile-grid">
            <div>
              <div className="card">
                <h2 className="card-title">Personal Information</h2>
                <div>
                  <p className="profile-info">Index Number: {profileData?.indexNo}</p>
                  <p className="profile-info">Joined: {profileData?.createdAt && new Date(profileData.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="card">
                <h2 className="card-title">Change Name</h2>
                <form onSubmit={handleNameChange}>
                  <div className="form-field">
                    <label htmlFor="newName" className="form-label">New Name</label>
                    <input
                      type="text"
                      id="newName"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="profile-btn"
                  >
                    {loading ? 'Updating...' : 'Update Name'}
                  </button>
                </form>
              </div>
            </div>
            
            <div>
              <div className="card">
                <h2 className="card-title">Change Email</h2>
                <form onSubmit={handleEmailChange}>
                  <div className="form-field">
                    <label htmlFor="newEmail" className="form-label">New Email</label>
                    <input
                      type="email"
                      id="newEmail"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="profile-btn"
                  >
                    {loading ? 'Updating...' : 'Update Email'}
                  </button>
                </form>
              </div>
              
              <div className="card">
                <h2 className="card-title">Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-field">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="profile-btn"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </Box>
  );
};

export default Profile;
