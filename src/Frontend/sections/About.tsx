import React, { ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';
import { FaChalkboardTeacher, FaUserGraduate, FaBook, FaClock } from 'react-icons/fa';

// Define props interface
interface AboutProps {
  isSignedIn: boolean;
  openSigninModal: () => void;
  navigateToApplication: () => void;
}

const About: React.FC<AboutProps> = ({ isSignedIn, openSigninModal, navigateToApplication }) => {
  // Icons used in UI
  const TeacherIcon = FaChalkboardTeacher as ComponentType<IconBaseProps>;
  const GraduateIcon = FaUserGraduate as ComponentType<IconBaseProps>;
  const BookIcon = FaBook as ComponentType<IconBaseProps>;
  const ClockIcon = FaClock as ComponentType<IconBaseProps>;

  // Handle button click depending on sign-in status
  const handleJoinNowClick = () => {
    if (isSignedIn) {
      navigateToApplication();
    } else {
      openSigninModal();
    }
  };

  return (
    <section className="about-section" id="about" aria-label="About Us Section">
      <div className="container">
        {/* Section Header */}
        <div className="about-header">
          <h2 className="about-main-title">ABOUT US</h2>
          <h3>Join Our Teaching Community</h3>
          <p className="about-intro">
            We connect passionate educators with eager learners, creating an environment 
            where knowledge meets opportunity. Choose your path and become part of our 
            growing educational ecosystem.
          </p>
        </div>

        {/* Role cards for Tutors and Lecturers */}
        <div className="role-cards">
          <div className="role-card applicants">
            <div className="role-icon">
              <TeacherIcon />
            </div>
            <h3>For Tutors</h3>
            <p>Share your expertise and inspire the next generation</p>
            <ul className="role-features">
              <li><BookIcon /> Flexible teaching schedules</li>
              <li><ClockIcon /> Set your own hours</li>
            </ul>
            <button 
              type="button"
              className="join-now-btn"
              onClick={handleJoinNowClick}
            >
              Join Now
            </button>
          </div>

          <div className="role-card lecturers">
            <div className="role-icon">
              <GraduateIcon />
            </div>
            <h3>For Lecturers</h3>
            <p>Join a network of Academic Professionals</p>
            <ul className="role-features">
              <li><BookIcon /> Access to research resources</li>
              <li><ClockIcon /> Academic opportunities</li>
            </ul>
            <button 
              type="button"
              className="join-now-btn"
              onClick={handleJoinNowClick}
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
