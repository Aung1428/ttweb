import React, { useState, ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBaseProps } from 'react-icons';
import { FaTimes } from 'react-icons/fa';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

interface SigninModalProps {
  isOpen: boolean;
  onClose: () => void;
  openSignupModal: () => void;
}

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const SigninModal: React.FC<SigninModalProps> = ({ isOpen, onClose, openSignupModal }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const CloseIcon = FaTimes as ComponentType<IconBaseProps>;
  const EyeIcon = IoEyeOutline as ComponentType<IconBaseProps>;
  const EyeOffIcon = IoEyeOffOutline as ComponentType<IconBaseProps>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please verify you're not a robot.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/users/signin', {
        ...formData,
        captchaToken,
      });

      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('userLoggedIn'));

      alert('Login successful!');
      onClose();

      const isLecturer = /@(student\.)?rmit\.edu\.au$/i.test(user.email);
      navigate(isLecturer ? '/lecturer' : '/application');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group password-input">
            <div className="input-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY || 'fallback'}
              onChange={(token: string | null) => {
                console.log("Received reCAPTCHA token:", token);
                setCaptchaToken(token);
              }}
              onExpired={() => {
                console.log("reCAPTCHA expired");
                setCaptchaToken(null);
              }}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="signin-form-divider">
          <p>
            Don't have an account?{' '}
            <span className="signup-link" onClick={() => {
              onClose();
              openSignupModal();
            }}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninModal;
