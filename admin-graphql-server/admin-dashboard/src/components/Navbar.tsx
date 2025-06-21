import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';


const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <h1 className="navbar-title">Admin Dashboard</h1>
          <nav className="navbar-links">
            <Link to="/courses" className="navbar-link">Manage Courses</Link>
            <Link to="/assign" className="navbar-link">Assign Lecturers</Link>
            <Link to="/block" className="navbar-link">Block Candidates</Link>
            <Link to="/reports" className="navbar-link">Reports</Link>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
