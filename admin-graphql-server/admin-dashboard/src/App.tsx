import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './components/Navbar';
import CourseManager from './pages/CourseManager';
import AssignLecturer from './pages/AssignLecturer';
import BlockCandidates from './pages/BlockCandidates';
import Reports from './pages/Reports';

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const isLoggedIn = localStorage.getItem('admin') === 'true';
  return isLoggedIn ? (
    <>
      {element}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/courses" element={<ProtectedRoute element={<CourseManager />} />} />
        <Route path="/assign" element={<ProtectedRoute element={<AssignLecturer />} />} />
        <Route path="/block" element={<ProtectedRoute element={<BlockCandidates />} />} />
        <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
