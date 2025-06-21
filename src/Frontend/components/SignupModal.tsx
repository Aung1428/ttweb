import React, { useState, ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';
import { FaTimes, FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';
import API from '../services/api';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  openSigninModal: () => void;
}

interface SignupFormData {
  role: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, openSigninModal }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    role: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  if (!isOpen) return null;

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setFormData({
      role,
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
    });
    setErrors({});
  };

  const validateEmail = (email: string): boolean => {
    const rmitEmailRegex = /@(student\.)?rmit\.edu\.au$/;
    return rmitEmailRegex.test(email);
  };

  const getPasswordStrength = (password: string): { label: string; color: string; score: number } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'red', score };
    if (score <= 4) return { label: 'Moderate', color: 'orange', score };
    return { label: 'Strong', color: 'green', score };
  };

  const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\S]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') setErrors(prev => ({ ...prev, email: undefined }));
    if (name === 'password') setErrors(prev => ({ ...prev, password: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPassword = formData.password.trim();
    const trimmedConfirm = formData.confirmPassword.trim();

    if (formData.role === 'lecturer' && !validateEmail(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please use an RMIT email address (@rmit.edu.au or @student.rmit.edu.au)',
      }));
      return;
    }

    if (!isPasswordValid(trimmedPassword)) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must meet all requirements listed in the tooltip.',
      }));
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      alert('Passwords do not match.');
      return;
    }

    const newUser: any = {
      role: formData.role,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: trimmedPassword,
    };

    if (formData.role === 'lecturer') {
      newUser.department = formData.department?.trim();
    }

    try {
      await API.post('/users/signup', newUser);
      alert('Signup successful!');
      onClose();
      openSigninModal();
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert('A user with this email already exists.');
      } else {
        alert('Signup failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const CloseIcon = FaTimes as ComponentType<IconBaseProps>;
  const EyeIcon = FaEye as ComponentType<IconBaseProps>;
  const EyeOffIcon = FaEyeSlash as ComponentType<IconBaseProps>;
  const InfoIcon = FaInfoCircle as ComponentType<IconBaseProps>;

  const passwordsMatch =
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.password.trim() === formData.confirmPassword.trim();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>

        {!selectedRole ? (
          <div className="role-selection">
            <h2>Choose Your Role</h2>
            <div className="role-buttons">
              <button className="role-button" onClick={() => handleRoleSelect('candidate')}>I am a Candidate</button>
              <button className="role-button" onClick={() => handleRoleSelect('lecturer')}>I am a Lecturer</button>
            </div>
          </div>
        ) : (
          <div className="signup-form">
            <h2>Sign Up as {selectedRole === 'candidate' ? 'Candidate' : 'Lecturer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-icon-row">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="tooltip-container">
                    <InfoIcon className="info-icon" />
                    <div className="tooltip-message">e.g., John Michael Doe</div>
                  </div>
                </div>
              </div>

              {selectedRole === 'lecturer' && (
                <div className="form-group">
                  <div className="input-icon-row">
                    <input
                      type="text"
                      name="department"
                      placeholder="Department"
                      value={formData.department || ''}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="tooltip-container">
                      <InfoIcon className="info-icon" />
                      <div className="tooltip-message">e.g., IT-Dept#3!</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="input-icon-row">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="tooltip-container">
                    <InfoIcon className="info-icon" />
                    <div className="tooltip-message">
                      {selectedRole === 'lecturer'
                        ? 'e.g., name@rmit.edu.au or name@student.rmit.edu.au'
                        : 'e.g., username@example.com'}
                    </div>
                  </div>
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group password-input">
                <div className="input-icon-row">
                  <div className="input-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                  </div>
                  <div className="tooltip-container">
                    <InfoIcon className="info-icon" />
                    <div className="tooltip-message">
                      <ul>
                        <li>At least 1 uppercase</li>
                        <li>At least 1 lowercase</li>
                        <li>At least 1 number</li>
                        <li>At least 1 special character</li>
                        <li>Minimum 8 characters</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {formData.password && (
                  <div className="password-strength-container">
                    <div
                      className="password-strength-bar"
                      style={{
                        width: `${getPasswordStrength(formData.password).score * 20}%`,
                        backgroundColor: getPasswordStrength(formData.password).color,
                      }}
                    />
                    <span
                      className="password-strength-label"
                      style={{ color: getPasswordStrength(formData.password).color }}
                    >
                      {getPasswordStrength(formData.password).label}
                    </span>
                  </div>
                )}
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              <div className="form-group password-input">
                <div className="input-icon-row">
                  <div className="input-password-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                  </div>
                  <div className="tooltip-container">
                    <InfoIcon className="info-icon" />
                    <div className="tooltip-message">Please re-enter your password</div>
                  </div>
                </div>
              </div>

              {formData.confirmPassword && (
                <div className={`password-match-status ${passwordsMatch ? 'match' : 'mismatch'}`}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}

              <div className="form-group button-group horizontal-buttons">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => {
                    setSelectedRole(null);
                    setFormData({
                      role: '',
                      fullName: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      department: '',
                    });
                    setErrors({});
                  }}
                >
                  Back
                </button>
                <button type="submit" className="submit-button">Create Account</button>
              </div>
            </form>
          </div>
        )}

        <hr className="divider" />
        <div className="signin-form-divider">
          <p>
            Already have an account?{' '}
            <span className="signup-link" onClick={() => {
              onClose();
              openSigninModal();
            }}>
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
