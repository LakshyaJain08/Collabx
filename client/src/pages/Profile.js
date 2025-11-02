import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/profile/${user.id}`);
      setProfile(response.data);
      setFormData({
        name: response.data.user.name,
        skills: response.data.user.skills?.join(', ') || '',
        location: response.data.user.location || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
      };
      await axios.put('/api/users/profile', updateData);
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile</h1>

        <div className="profile-content">
          <div className="profile-main">
            <div className="card">
              <div className="profile-header">
                <h2>{profile.user.name}</h2>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="btn btn-primary">
                    Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        fetchProfile();
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <p><strong>Username:</strong> {profile.user.username}</p>
                  <p><strong>Email:</strong> {profile.user.email}</p>
                  {profile.user.skills && profile.user.skills.length > 0 && (
                    <div>
                      <strong>Skills:</strong>
                      <div className="skills-list">
                        {profile.user.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.user.location && (
                    <p><strong>Location:</strong> {profile.user.location}</p>
                  )}
                  {profile.user.badges && profile.user.badges.length > 0 && (
                    <div>
                      <strong>Badges:</strong>
                      <div className="badges-list">
                        {profile.user.badges.map((badge, idx) => (
                          <span key={idx} className="badge">{badge}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card">
              <h2>Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{profile.stats.hostedActivities}</div>
                  <div className="stat-label">Hosted Activities</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{profile.stats.activeMemberships}</div>
                  <div className="stat-label">Active Memberships</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{profile.stats.completedTasks}</div>
                  <div className="stat-label">Completed Tasks</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{profile.stats.totalTasks}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
