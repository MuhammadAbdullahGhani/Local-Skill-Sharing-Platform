import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import
import Login from './components/Login';
import Signup from './components/Signup';
import UserManagement from './components/UserManagement'; // Replaced Dashboard with UserManagement
import SkillManagementPage from './components/SkillManagementPage';
import Booking from './components/Booking'; // Removed Booking import
import Analytics from './components/Analytics'; // Correct import
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // Check if a user is authenticated when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setUserInfo({
          userId: decodedToken.userId,
          name: decodedToken.name,
        });
      } catch (error) {
        console.error('Invalid token', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/user-management" /> : <Navigate to="/login" />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={<Login setAuth={setIsAuthenticated} />}
        />

        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* UserManagement Route - Protected Route */}
        <Route
          path="/user-management"
          element={isAuthenticated ? <UserManagement userInfo={userInfo} /> : <Navigate to="/login" />}
        />
          <Route path="/skill-management" element={<SkillManagementPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
};

export default App;
