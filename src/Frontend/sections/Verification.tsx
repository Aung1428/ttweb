import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';

const Verification: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
  return (
    <div className="application-page">
      <h2>⚠️ Application data missing</h2>
      <p>You may have refreshed the page or visited this URL directly.</p>
      <button onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
}

  const {
    fullName,
    email,
    availability,
    skills,
    academicCredentials,
    course,
  } = state as {
    fullName: string;
    email: string;
    availability: string;
    skills: string;
    academicCredentials: string;
    course: {
      id: number;
      code: string;
      name: string;
      semester: string;
    };
  };

  const handleConfirm = () => {
    alert('Application confirmed and submitted!');
    navigate('/');
  };

  return (
    <div className="application-page">
      <h1>Verify Your Application</h1>
      <div className="verification-box">
        <ul>
          <li><strong>Full Name:</strong> {fullName}</li>
          <li><strong>Email:</strong> {email}</li>
          <li><strong>Availability:</strong> {availability}</li>
          <li><strong>Skills:</strong> {skills}</li>
          <li><strong>Academic Credentials:</strong> {academicCredentials}</li>
          <li><strong>Preferred Course:</strong> {course.name} ({course.code})</li>
        </ul>
        <button className="confirm-button" onClick={handleConfirm}>Confirm & Submit</button>
      </div>
    </div>
  );
};

export default Verification;
