import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import './CreateActivity.css';

const CreateActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Academic',
    startDate: '',
    endDate: '',
    location: '',
    desiredOutcome: '',
    investmentsRequired: '',
    requiredSkills: '',
    termsAndConditions: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const activityData = {
        ...formData,
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(',').map(s => s.trim())
          : []
      };

      const response = await axios.post('/api/activities', activityData);
      navigate(`/activities/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-activity-page">
      <div className="container">
        <h1>Create New Activity</h1>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Activity Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Activity Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Academic">Academic</option>
                <option value="Physical">Physical</option>
                <option value="Religious">Religious</option>
                <option value="Professional">Professional</option>
                <option value="Research">Research</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Required Skills (comma-separated)</label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g., JavaScript, Python, Design"
              />
            </div>

            <div className="form-group">
              <label>Desired Outcome</label>
              <textarea
                name="desiredOutcome"
                value={formData.desiredOutcome}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Investments Required</label>
              <textarea
                name="investmentsRequired"
                value={formData.investmentsRequired}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Terms and Conditions</label>
              <textarea
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={handleChange}
                rows={4}
                placeholder="Specify any contractual obligations or terms..."
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Activity'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/activities')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivity;
