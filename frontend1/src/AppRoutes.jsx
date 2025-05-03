// AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentQuizDynamic from './pages/StudentQuizDynamic';
import LoginLaunchPage from './pages/LoginLaunchPage';
import QuizSelector from './pages/QuizSelector';

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user === 'test';
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    // <Router>
      <Routes>
        <Route path="/loginLaunchPage" element={<LoginLaunchPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
         <Route path="/select-quiz" element={<PrivateRoute><QuizSelector /></PrivateRoute>} />
        <Route path="/quiz" element={
          <PrivateRoute><StudentQuizDynamic /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/loginLaunchPage" />} />
      </Routes>
    // </Router>
  );
}
