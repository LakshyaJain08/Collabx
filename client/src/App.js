import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Dashboard from './pages/Dashboard';
import MyProjects from './pages/MyProjects';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateActivity from './pages/CreateActivity';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={<PrivateRoute><Dashboard /></PrivateRoute>} 
              />
              <Route 
                path="/my-projects" 
                element={<PrivateRoute><MyProjects /></PrivateRoute>} 
              />
              <Route 
                path="/profile" 
                element={<PrivateRoute><Profile /></PrivateRoute>} 
              />
              <Route 
                path="/create-activity" 
                element={<PrivateRoute><CreateActivity /></PrivateRoute>} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
