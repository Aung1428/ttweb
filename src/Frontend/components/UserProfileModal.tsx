import React, { ComponentType, useState } from 'react';
import { IconBaseProps } from 'react-icons';
import { FaTimes as FaTimesIcon } from 'react-icons/fa';
import '../../App.css';
import API from '../services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    fullName: string;
    email: string;
    department?: string;
    avatar?: string;
    createdAt?: string;
    [key: string]: any;
  } | null;
}

const avatarOptions = Array.from({ length: 5 }, (_, i) => `avatar${i + 1}.jpg`);

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(user?.avatar);
  const [showAvatars, setShowAvatars] = useState<boolean>(false);

  if (!isOpen || !user) return null;

  const FaTimes = FaTimesIcon as ComponentType<IconBaseProps>;
  const isLecturer = /@(student\.)?rmit\.edu\.au$/i.test(user.email);

  const handleAvatarClick = () => {
    setShowAvatars(prev => !prev); // Toggle avatar grid visibility
  };

  const updateAvatar = async (filename: string) => {
    try {
      await API.put('/users/update-avatar', { email: user.email, avatar: filename });
      const updatedUser = { ...user, avatar: filename };
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setSelectedAvatar(filename);
      setShowAvatars(false); // Hide selection after choosing
    } catch (err) {
      alert('Failed to update avatar.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} title="Close" />
        </div>

        <h2>User Profile</h2>

        {/* Avatar display */}
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <img
            src={`/avatars/${selectedAvatar || 'avatar1.jpg'}`}
            onError={(e) => (e.currentTarget.src = '/avatars/avatar1.jpg')}
            alt="avatar"
            style={{ width: 100, height: 100, borderRadius: '50%', cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
        </div>

        {/* User Info */}
        <div><strong>Full Name:</strong> {user.fullName}</div>
        <div><strong>Email:</strong> {user.email}</div>
        {user.createdAt && <div><strong>Joined Date:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>}
        {isLecturer && user.department && <div><strong>Department:</strong> {user.department}</div>}

        {/* Avatar Selection */}
        {showAvatars && (
          <>
            <h4 style={{ marginTop: 20 }}>Choose Avatar</h4>
            <div className="avatar-grid">
              {avatarOptions.map((filename) => (
                <img
                  key={filename}
                  src={`/avatars/${filename}`}
                  alt={filename}
                  className={`avatar-option ${selectedAvatar === filename ? 'selected' : ''}`}
                  onClick={() => updateAvatar(filename)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
