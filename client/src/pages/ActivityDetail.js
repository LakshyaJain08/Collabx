import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import './ActivityDetail.css';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activity, setActivity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinRole, setJoinRole] = useState('secondary');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/activities/${id}`);
      setActivity(response.data.activity);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error('Error fetching activity:', error);
      setMessage('Error loading activity');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/activities/${id}/join`, { role: joinRole });
      setMessage('Request to join sent successfully!');
      setTimeout(() => {
        fetchActivity();
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error joining activity');
    }
  };

  if (loading) {
    return <div className="loading">Loading activity...</div>;
  }

  if (!activity) {
    return <div className="error">Activity not found</div>;
  }

  const isHost = user && activity.host._id === user.id;

  return (
    <div className="activity-detail-page">
      <div className="container">
        <div className="activity-detail">
          <div className="activity-main">
            <div className="activity-header-detail">
              <h1>{activity.title}</h1>
              <span className="activity-type">{activity.type}</span>
            </div>

            <div className="activity-info">
              <div className="info-item">
                <strong>Host:</strong> {activity.host?.name || activity.host?.username}
              </div>
              <div className="info-item">
                <strong>Start Date:</strong> {format(new Date(activity.startDate), 'MMMM dd, yyyy')}
              </div>
              <div className="info-item">
                <strong>End Date:</strong> {format(new Date(activity.endDate), 'MMMM dd, yyyy')}
              </div>
              {activity.location && (
                <div className="info-item">
                  <strong>Location:</strong> {activity.location}
                </div>
              )}
            </div>

            <div className="activity-description-full">
              <h3>Description</h3>
              <p>{activity.description}</p>
            </div>

            {activity.desiredOutcome && (
              <div className="activity-section">
                <h3>Desired Outcome</h3>
                <p>{activity.desiredOutcome}</p>
              </div>
            )}

            {activity.investmentsRequired && (
              <div className="activity-section">
                <h3>Investments Required</h3>
                <p>{activity.investmentsRequired}</p>
              </div>
            )}

            {activity.requiredSkills && activity.requiredSkills.length > 0 && (
              <div className="activity-section">
                <h3>Required Skills</h3>
                <div className="activity-skills">
                  {activity.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {activity.termsAndConditions && (
              <div className="activity-section">
                <h3>Terms and Conditions</h3>
                <p>{activity.termsAndConditions}</p>
              </div>
            )}

            {!isHost && user && (
              <div className="join-section">
                <h3>Join this Activity</h3>
                <div className="form-group">
                  <label>Member Role</label>
                  <select
                    value={joinRole}
                    onChange={(e) => setJoinRole(e.target.value)}
                    className="form-control"
                  >
                    <option value="secondary">Secondary Member</option>
                    <option value="primary">Primary Member</option>
                    <option value="temporary">Temporary Member</option>
                  </select>
                </div>
                <button onClick={handleJoin} className="btn btn-primary">
                  Request to Join
                </button>
                {message && (
                  <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
                    {message}
                  </div>
                )}
              </div>
            )}

            {!user && (
              <div className="join-section">
                <p>Please <a href="/login">login</a> to join this activity</p>
              </div>
            )}
          </div>

          <div className="activity-sidebar">
            <div className="card">
              <h3>Members ({members.length})</h3>
              {members.length === 0 ? (
                <p>No members yet</p>
              ) : (
                <div className="members-list">
                  {members.map(member => (
                    <div key={member._id} className="member-item">
                      <strong>{member.user?.name || member.user?.username}</strong>
                      <span className="member-role">{member.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isHost && (
              <div className="card">
                <button
                  onClick={() => navigate(`/dashboard?activity=${id}`)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Manage Activity
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
