import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { format } from 'date-fns';
import './Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    location: '',
    skill: ''
  });

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.skill) params.append('skill', filters.skill);

      const response = await axios.get(`/api/activities?${params.toString()}`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div className="activities-page">
      <div className="container">
        <h1>Browse Activities</h1>

        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search activities..."
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="Academic">Academic</option>
            <option value="Physical">Physical</option>
            <option value="Religious">Religious</option>
            <option value="Professional">Professional</option>
            <option value="Research">Research</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="text"
            name="skill"
            placeholder="Required Skill"
            value={filters.skill}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="activities-grid">
          {activities.length === 0 ? (
            <p className="no-activities">No activities found. Try adjusting your filters.</p>
          ) : (
            activities.map(activity => (
              <div key={activity._id} className="activity-card">
                <div className="activity-header">
                  <h3>{activity.title}</h3>
                  <span className="activity-type">{activity.type}</span>
                </div>
                <p className="activity-description">
                  {activity.description.substring(0, 150)}...
                </p>
                <div className="activity-details">
                  <p><strong>Host:</strong> {activity.host?.name || activity.host?.username}</p>
                  <p><strong>Start:</strong> {format(new Date(activity.startDate), 'MMM dd, yyyy')}</p>
                  <p><strong>End:</strong> {format(new Date(activity.endDate), 'MMM dd, yyyy')}</p>
                  {activity.location && (
                    <p><strong>Location:</strong> {activity.location}</p>
                  )}
                </div>
                {activity.requiredSkills && activity.requiredSkills.length > 0 && (
                  <div className="activity-skills">
                    {activity.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                )}
                <Link to={`/activities/${activity._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
