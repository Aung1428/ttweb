import React, { useEffect, useState, ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';
import { FaTimes } from 'react-icons/fa';
import '../../App.css';

interface ApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({ isOpen, onClose, userEmail }) => {
  const [userApps, setUserApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const CloseIcon = FaTimes as ComponentType<IconBaseProps>;

  const getStatusFromComment = (comment?: string): string => {
    if (!comment) return 'In Progress';
    const lower = comment.toLowerCase();
    const successWords = ['success', 'approved', 'accepted', 'excellent', 'yes', 'confirmed'];
    const failWords = ['fail', 'rejected', 'denied', 'declined', 'no'];

    if (successWords.some(word => lower.includes(word))) return 'Accepted';
    if (failWords.some(word => lower.includes(word))) return 'Rejected';
    return 'In Progress';
  };

  const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Accepted': return { color: '#2e7d32', backgroundColor: '#d0f0d0' };
    case 'Rejected': return { color: '#c62828', backgroundColor: '#fddede' };
    default: return { color: '#555', backgroundColor: '#eee' };
  }
};

  useEffect(() => {
    if (isOpen && userEmail) {
      setLoading(true);
      fetch(`http://localhost:3001/api/applications?email=${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(data => setUserApps(data))
        .catch(err => {
          console.error('Failed to fetch applications:', err);
          setUserApps([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxHeight: '90vh', width: '100%', maxWidth: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: '0 auto', textAlign: 'center', flex: 1 }}>Application Status</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem' }}>
            <CloseIcon />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
          {loading ? (
            <p style={{ marginTop: '20px' }}>Loading applications...</p>
          ) : userApps.length === 0 ? (
            <p style={{ marginTop: '20px' }}>You have not applied for any roles yet.</p>
          ) : (
            userApps.map((app: any, index: number) => {
              const status = getStatusFromComment(app.comments);
              return (
                <div key={index} className="status-card" style={{
                  border: '1px solid #ccc',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '20px 0',
                  backgroundColor: '#f9f9f9',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
                    <span>
                      {app.position} (
                      {app.course
                        ? typeof app.course === 'object'
                          ? app.course.name
                          : app.course
                        : 'N/A'}
                      )
                    </span>
                    <span>{app.availability}</span>
                  </div>

                  <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                    <strong>Submitted At:</strong>
                    <p style={{ marginTop: '5px', marginLeft: '10px' }}>{new Date(app.submittedAt).toLocaleString()}</p>
                  </div>

                  <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                    <strong>Skills:</strong>
                    <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                      {app.skills?.split(',').map((skill: string, idx: number) => (
                        <li key={idx}>{skill.trim()}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                    <strong>Comments:</strong>
                    <p style={{ marginTop: '5px', marginLeft: '10px' }}>{app.comments || '—'}</p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontWeight: 'bold',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      ...getStatusStyle(status)
                    }}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusModal;
