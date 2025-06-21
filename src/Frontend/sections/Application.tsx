import React, { useState, useEffect, ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { getLoggedInUser } from '../context/userContext';
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaMicroscope,
} from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import API from '../services/api';

interface ApplicationFormData {
  fullName: string;
  email: string;
  availability: string;
  skills: string;
  academicCredentials: string;
  course: string; // course code
  position: string;
}

interface CourseOption {
  id: number;
  code: string;
  name: string;
  semester: string;
}

const Application: React.FC = () => {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const [formVisible, setFormVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [filter, setFilter] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    availability: '',
    skills: '',
    academicCredentials: '',
    course: '',
    position: '',
  });

  const isLecturer = user?.email?.match(/@(student\.)?rmit\.edu\.au$/i);

  useEffect(() => {
  if (!isLecturer) {
    API.get('/courses')
      .then(res => setCourseOptions(res.data))
      .catch(() => alert('Failed to load courses.'));
  }
}, [isLecturer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCardClick = (position: string) => {
    setSelectedPosition(position);
    setFormVisible(true);
    setFormData(prev => ({
      ...prev,
      position,
      fullName: user?.fullName || '',
      email: user?.email || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!gmailRegex.test(formData.email)) newErrors.email = 'Enter a valid Gmail.';
    if (!formData.availability) newErrors.availability = 'Availability is required.';
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required.';
    if (!formData.academicCredentials.trim()) newErrors.academicCredentials = 'Academic credentials required.';
    if (!formData.course) newErrors.course = 'Select a course.';

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      const response = await API.post('/applications', formData);
      navigate('/verification', { state: response.data });
    } catch (err: any) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else alert('Server error while submitting application.');
    }
  };

  const handleGoBack = () => {
    if (window.confirm('Are you sure you want to leave the application?')) {
      setFormVisible(false);
      setSelectedPosition('');
    }
  };

  const TutorIcon = FaChalkboardTeacher as ComponentType<IconBaseProps>;
  const LabIcon = FaMicroscope as ComponentType<IconBaseProps>;
  const ArrowIcon = FaArrowLeft as ComponentType<IconBaseProps>;

  const positions = ['Tutor', 'Lab Assistant'];

  return (
    <div className="application-page">
      <div className="application-header" style={{ backgroundColor: '#e8545c', textAlign: 'center', width: '100vw' }}>
        <h1>{isLecturer ? 'Applications' : 'Job Application'}</h1>
        <p>
          {isLecturer
            ? 'View submitted tutor/lab assistant applications.'
            : 'Apply for Tutor or Lab Assistant roles at RMIT.'}
        </p>
      </div>

      {!isLecturer ? (
        !formVisible ? (
          <>
            <p style={{ marginTop: '30px', textAlign: 'center' }}>Select a job application:</p>
            <div className="card-container">
              {positions.map((pos) => (
                <div key={pos} className="card small-card">
                  {(pos === 'Tutor' ? <TutorIcon size={36} /> : <LabIcon size={36} />)}
                  <h3><strong>{pos}</strong></h3>
                  <button className="apply-btn" onClick={() => handleCardClick(pos)}>Apply Now</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="back-arrow" onClick={handleGoBack}>
              <ArrowIcon /> Back to Job Options
            </div>
            <form className="resume-form" onSubmit={handleSubmit}>
              {['fullName', 'email', 'availability', 'skills', 'academicCredentials', 'course'].map(field => (
                <div key={field}>
                  <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
                  {field === 'academicCredentials' ? (
                    <textarea
                      name={field}
                      value={formData[field as keyof ApplicationFormData]}
                      onChange={handleChange}
                      className={errors[field] ? 'input-error' : ''}
                    />
                  ) : field === 'availability' ? (
                    <select
                      name={field}
                      value={formData[field as keyof ApplicationFormData]}
                      onChange={handleChange}
                      className={errors[field] ? 'input-error' : ''}
                    >
                      <option value="">Select</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Full Time">Full Time</option>
                    </select>
                  ) : field === 'course' ? (
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={errors.course ? 'input-error' : ''}
                    >
                      <option value="">Select</option>
                      {courseOptions.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={formData[field as keyof ApplicationFormData]}
                      onChange={handleChange}
                      className={errors[field] ? 'input-error' : ''}
                    />
                  )}
                  {errors[field] && <div className="error-text">{errors[field]}</div>}
                </div>
              ))}
              <button type="submit">Submit Application</button>
            </form>
          </>
        )
      ) : (
        <>
          <div className="filter-container">
            <label>Filter by Role:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Tutor">Tutor</option>
              <option value="Lab Assistant">Lab Assistant</option>
            </select>
          </div>

          <div className="application-list">
            {applications
              .filter(app => filter === 'All' || app.position === filter)
              .map((app, idx) => (
                <div key={idx} className="application-card">
                  <h3>{app.position}</h3>
                  <p><strong>Candidate:</strong> {app.candidate?.fullName || app.fullName}</p>
                  <p><strong>Email:</strong> {app.candidate?.email || app.email}</p>
                  <p><strong>Availability:</strong> {app.availability}</p>
                  <p>
                    <strong>Course:</strong>{" "}
                    {app.course && typeof app.course === "object"
                      ? `${app.course.name} (${app.course.code})`
                      : String(app.course)}
                  </p>
                  <p><strong>Skills:</strong> {app.skills}</p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Application;
