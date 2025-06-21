import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Contact from './Contact';
import Home from './Home';
import About from './About';
import SigninModal from '../components/SigninModal';
import SignupModal from '../components/SignupModal';
import { getLoggedInUser } from '../context/userContext';

import { IconType } from 'react-icons';

interface ContactIcon {
  Icon: IconType;
  text: string;
}

const Main: React.FC = () => {
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = getLoggedInUser();
    setIsSignedIn(!!user);
  }, [isSigninModalOpen, isSignupModalOpen]);

  const navigateToApplication = () => {
    const user = getLoggedInUser();
    if (!user) {
      setIsSigninModalOpen(true);
    } else if (user.role === 'lecturer') {
      navigate('/lecturer'); // ✅ Navigate to lecturer route
    } else {
      navigate('/application'); // ✅ Navigate to tutor application page
    }
  };

  // const contactIcons: ContactIcon[] = [
  //   { Icon: MdEmail, text: 'info@example.com' },
  //   { Icon: MdPhone, text: '+1 5589 55488 558' },
  //   { Icon: MdLocationOn, text: 'A108 Adam Street, New York, NY 535022' }
  // ];

  return (
    <main className="main-content">
      <div className="home-sections">
        <Home openSigninModal={() => setIsSigninModalOpen(true)} />

        <About
          isSignedIn={isSignedIn}
          openSigninModal={() => setIsSigninModalOpen(true)}
          navigateToApplication={navigateToApplication}
        />

        <Contact />
      </div>

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
    </main>
  );
};

export default Main;
