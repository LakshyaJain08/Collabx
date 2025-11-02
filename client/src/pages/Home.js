import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Collabx</h1>
        <p className="hero-subtitle">A Collaboration Platform</p>
        <p className="hero-description">
          Find collaborators for various activities spanning from professional research projects 
          to finding mates to play sports with. Collaborate and coordinate any group activity.
        </p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/activities" className="btn btn-secondary">Browse Activities</Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Activity Hosting</h3>
              <p>Create and manage your projects with detailed descriptions, timelines, and requirements.</p>
            </div>
            <div className="feature-card">
              <h3>Search & Join</h3>
              <p>Discover activities by topic, skill, or location. Request to join activities that match your interests.</p>
            </div>
            <div className="feature-card">
              <h3>Task Management</h3>
              <p>Assign tasks, track progress, and collaborate effectively with your team members.</p>
            </div>
            <div className="feature-card">
              <h3>Progress Tracking</h3>
              <p>Monitor project progress with dynamic dashboards and real-time updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
