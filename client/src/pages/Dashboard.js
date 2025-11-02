import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activityId, setActivityId] = useState(null);
  const [activity, setActivity] = useState(null);
  const [requests, setRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('activity');
    if (id) {
      setActivityId(id);
      fetchActivityData(id);
    } else {
      fetchUserActivities();
    }
  }, []);

  const fetchUserActivities = async () => {
    try {
      const response = await axios.get('/api/users/my-activities');
      if (response.data.hosted && response.data.hosted.length > 0) {
        setActivityId(response.data.hosted[0]._id);
        fetchActivityData(response.data.hosted[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const fetchActivityData = async (id) => {
    try {
      setLoading(true);
      const [activityRes, requestsRes, tasksRes] = await Promise.all([
        axios.get(`/api/activities/${id}`),
        axios.get(`/api/activities/${id}/requests`),
        axios.get(`/api/tasks?activity=${id}`)
      ]);

      setActivity(activityRes.data.activity);
      setRequests(requestsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await axios.put(`/api/activities/${activityId}/requests/${requestId}`, { status });
      fetchActivityData(activityId);
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      await axios.post('/api/tasks', { ...taskData, activity: activityId });
      fetchActivityData(activityId);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, updates);
      fetchActivityData(activityId);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!activity) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <h1>Dashboard</h1>
          <p>You don't have any hosted activities yet.</p>
          <button onClick={() => navigate('/create-activity')} className="btn btn-primary">
            Create Your First Activity
          </button>
        </div>
      </div>
    );
  }

  const isHost = user && activity.host._id === user.id;

  if (!isHost) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <p>You don't have permission to manage this activity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Dashboard - {activity.title}</h1>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="card">
              <h2>Activity Overview</h2>
              <p><strong>Status:</strong> {activity.status}</p>
              <p><strong>Type:</strong> {activity.type}</p>
              <p><strong>Start Date:</strong> {format(new Date(activity.startDate), 'MMM dd, yyyy')}</p>
              <p><strong>End Date:</strong> {format(new Date(activity.endDate), 'MMM dd, yyyy')}</p>
            </div>

            <div className="card">
              <h2>Collaboration Requests</h2>
              {requests.length === 0 ? (
                <p>No pending requests</p>
              ) : (
                <div className="requests-list">
                  {requests.map(request => (
                    <div key={request._id} className="request-item">
                      <div>
                        <strong>{request.user?.name || request.user?.username}</strong>
                        <p>Role: {request.role}</p>
                        {request.user?.skills && (
                          <p>Skills: {request.user.skills.join(', ')}</p>
                        )}
                      </div>
                      <div className="request-actions">
                        <button
                          onClick={() => handleRequestAction(request._id, 'accepted')}
                          className="btn btn-success"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(request._id, 'rejected')}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h2>Tasks</h2>
              <TaskList
                tasks={tasks}
                onUpdate={handleTaskUpdate}
                onCreate={handleTaskCreate}
                activityId={activityId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onUpdate, onCreate, activityId }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: ''
    });
    setShowForm(false);
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ marginBottom: '15px' }}>
        {showForm ? 'Cancel' : '+ Add Task'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">Create Task</button>
        </form>
      )}

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task._id} className="task-item">
              <div>
                <h4>{task.title}</h4>
                {task.description && <p>{task.description}</p>}
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                {task.assignedTo && (
                  <p><strong>Assigned to:</strong> {task.assignedTo?.name || task.assignedTo?.username}</p>
                )}
              </div>
              <select
                value={task.status}
                onChange={(e) => onUpdate(task._id, { status: e.target.value })}
                className="task-status-select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
