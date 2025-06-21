import React, { useState, useEffect, ComponentType } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconBaseProps } from 'react-icons';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import SigninModal from './SigninModal';
import SignupModal from './SignupModal';
import UserProfileModal from './UserProfileModal';
import ApplicationStatusModal from './ApplicationStatusModal';
import ReportsModal from './ReportsModal';
import { getLoggedInUser, logoutUser } from '../context/userContext';
import '../../App.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAppStatusOpen, setIsAppStatusOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(() => getLoggedInUser());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  

  useEffect(() => {
    const currentUser = getLoggedInUser();
    setUser(currentUser);
  }, [isSigninModalOpen, isSignupModalOpen]);

  useEffect(() => {
    const updateUser = () => setUser(getLoggedInUser());
    window.addEventListener('userLoggedIn', updateUser);
    return () => window.removeEventListener('userLoggedIn', updateUser);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname + location.hash === path;
  };

  const MenuIcon = (isMenuOpen ? FaTimes : FaBars) as ComponentType<IconBaseProps>;
  const DropdownIcon = FaChevronDown as ComponentType<IconBaseProps>;

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getUserRole = (): 'lecturer' | 'tutor' | null => {
    if (!user || !user.email) return null;
    return /@(student\.)?rmit\.edu\.au$/i.test(user.email) ? 'lecturer' : 'tutor';
  };

  const handleJobMentorClick = () => {
    if (!user) {
      setIsSigninModalOpen(true);
    } else {
      const role = getUserRole();
      navigate(role === 'lecturer' ? '/lecturer' : '/application');
      setIsMenuOpen(false);
    }
  };

  const renderJobMentorLabel = () => {
    const role = getUserRole();
    return role === 'lecturer' ? 'Applicants' : 'JobMentor';
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link to="/#home" onClick={() => setIsMenuOpen(false)}>TTWebSystem</Link>
          </div>
          <div className="mobile-menu-button" onClick={toggleMenu}>
            <MenuIcon />
          </div>
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li>
                <Link to="/#home" onClick={() => setIsMenuOpen(false)} className={isActive("/#home") ? "active" : ""}>Home</Link>
              </li>
              <li>
                <Link to="/#about" onClick={() => setIsMenuOpen(false)} className={isActive("/#about") ? "active" : ""}>About</Link>
              </li>
              <li>
                <Link to="#" onClick={(e) => { e.preventDefault(); handleJobMentorClick(); }}
                  className={isActive("/application") || isActive("/lecturer") ? "active" : ""}>
                  {renderJobMentorLabel()}
                </Link>
              </li>
              <li>
                <Link to="/#contact" onClick={() => setIsMenuOpen(false)} className={isActive("/#contact") ? "active" : ""}>Contact</Link>
              </li>
            </ul>
          </nav>

          <div className={`auth-buttons ${isMenuOpen ? 'active' : ''}`}>
            {!user ? (
              <>
                <button className="signin-btn" onClick={() => setIsSigninModalOpen(true)}>Sign In</button>
                <button className="signup-btn" onClick={() => setIsSignupModalOpen(true)}>Sign Up</button>
              </>
            ) : (
              <div className="user-dropdown">
                <div className="user-greeting-container">
                <div className="user-greeting">
                  <span className="welcome-label">Welcome, </span>
                  <span className="user-name">{user.fullName}</span>
                </div>
              </div>
                <button className="user-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <DropdownIcon style={{ marginLeft: '8px', color: '#000' }} />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {getUserRole() === 'tutor' && (
                      <>
                        <button onClick={() => { setIsDropdownOpen(false); setIsAppStatusOpen(true); }}>Application Status</button>
                        <button onClick={() => { setIsDropdownOpen(false); setIsProfileOpen(true); }}>User Profile</button>
                      </>
                    )}
                    {getUserRole() === 'lecturer' && (
                      <>
                        <button onClick={() => { setIsDropdownOpen(false); setIsProfileOpen(true); }}>User Profile</button>
                        <button onClick={() => { setIsDropdownOpen(false); setIsReportsModalOpen(true); }}>Reports</button>
                      </>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
      <ApplicationStatusModal isOpen={isAppStatusOpen} onClose={() => setIsAppStatusOpen(false)} userEmail={user?.email} />
      <ReportsModal isOpen={isReportsModalOpen} onClose={() => setIsReportsModalOpen(false)} />
      <SigninModal
        isOpen={isSigninModalOpen}
        onClose={() => setIsSigninModalOpen(false)}
        openSignupModal={() => {
          setIsSigninModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        openSigninModal={() => {
          setIsSignupModalOpen(false);
          setIsSigninModalOpen(true);
        }}
      />
    </>
  );
};

export default Header;
