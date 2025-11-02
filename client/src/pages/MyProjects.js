import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { format } from 'date-fns';
import './MyProjects.css';

const MyProjects = () => {
  const [hosted, setHosted] = useState([]);
  const [participating, setParticipating] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const response = await axios.get('/api/users/my-activities');
      setHosted(response.data.hosted || []);
      setParticipating(response.data.participating || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your projects...</div>;
  }

  return (
    <div className="my-projects-page">
      <div className="container">
        <h1>My Projects</h1>

        <div className="projects-section">
          <h2>Hosted Activities</h2>
          {hosted.length === 0 ? (
            <p>You haven't hosted any activities yet.</p>
          ) : (
            <div className="projects-grid">
              {hosted.map(activity => (
                <div key={activity._id} className="project-card">
                  <h3>{activity.title}</h3>
                  <p className="project-type">{activity.type}</p>
                  <p className="project-description">{activity.description.substring(0, 100)}...</p>
                  <div className="project-dates">
                    <p>Start: {format(new Date(activity.startDate), 'MMM dd, yyyy')}</p>
                    <p>End: {format(new Date(activity.endDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <Link to={`/activities/${activity._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                  <Link to={`/dashboard?activity=${activity._id}`} className="btn btn-secondary">
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="projects-section">
          <h2>Participating Activities</h2>
          {participating.length === 0 ? (
            <p>You're not participating in any activities yet.</p>
          ) : (
            <div className="projects-grid">
              {participating.map(activity => (
                <div key={activity._id} className="project-card">
                  <h3>{activity.title}</h3>
                  <p className="project-type">{activity.type}</p>
                  <p className="project-description">{activity.description.substring(0, 100)}...</p>
                  <div className="project-dates">
                    <p>Start: {format(new Date(activity.startDate), 'MMM dd, yyyy')}</p>
                    <p>End: {format(new Date(activity.endDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <Link to={`/activities/${activity._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
