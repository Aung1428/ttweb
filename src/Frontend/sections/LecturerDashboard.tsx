import React, { useEffect, useState } from 'react';
import '../../App.css';

interface Applicant {
  id: number;
  fullName: string;
  email: string;
  availability: string;
  skills: string;
  academicCredentials: string;
  course: { id: number; code: string; name: string; semester: string } | string;
  position?: string;
  rank?: number;
  comments?: string;
  status?: string;
}

const Lecturer: React.FC = () => {
  const [originalApplicants, setOriginalApplicants] = useState<Applicant[]>([]);
  const [editedApplicants, setEditedApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'course' | 'availability'>('course');

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        setOriginalApplicants(data);
        setEditedApplicants(data.map((app: Applicant) => ({ ...app })));
      })
      .catch(console.error);
  }, []);

  const getStatusFromComment = (comment?: string): string => {
    if (!comment) return 'In Progress';
    const lower = comment.toLowerCase().trim();

    const failKeywords = ['fail', 'rejected', 'declined', 'denied', 'poor', 'no', 'not selected'];
    const successKeywords = ['success', 'approved', 'accepted', 'selected', 'excellent', 'great', 'yes'];

    if (failKeywords.some(word => lower.includes(word))) return 'Rejected';
    if (successKeywords.some(word => lower.includes(word))) return 'Accepted';

    return 'In Progress';
  };

  const updateApplicant = async (updatedApplicant: Applicant) => {
    try {
      await fetch('/api/applications/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedApplicant.id,
          rank: updatedApplicant.rank,
          comments: updatedApplicant.comments,
          status: updatedApplicant.status
        }),
      });


      setOriginalApplicants(prev =>
        prev.map(app => app.id === updatedApplicant.id ? updatedApplicant : app)
      );
      setEditedApplicants(prev =>
        prev.map(app => app.id === updatedApplicant.id ? updatedApplicant : app)
      );
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleRankChange = (id: number, value: string) => {
    const parsed = parseInt(value);
    setEditedApplicants(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, rank: isNaN(parsed) || parsed < 1 ? undefined : parsed }
          : app
      )
    );
  };

  const handleCommentChange = (id: number, value: string) => {
    setEditedApplicants(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, comments: value }
          : app
      )
    );
  };

  const handleSendComment = (applicant: Applicant) => {
    const newStatus = getStatusFromComment(applicant.comments);
    const updatedApplicant = {
      ...applicant,
      status: newStatus,
    };

    alert(`Comment sent to ${applicant.fullName} at ${applicant.email}:\n"${applicant.comments}"\nStatus: ${newStatus}`);
    updateApplicant(updatedApplicant);
  };

  const filterAndSortApplicants = (list: Applicant[]) => {
    return list
      .filter(applicant => {
        const query = search.toLowerCase();
        return (
          applicant.fullName.toLowerCase().includes(query) ||
          (typeof applicant.course === 'string'
            ? applicant.course.toLowerCase()
            : `${applicant.course.name} ${applicant.course.code} ${applicant.course.semester}`.toLowerCase()
          ).includes(query) ||
          applicant.availability.toLowerCase().includes(query) ||
          applicant.skills.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortField === 'course') {
          const aCourseName =
            typeof a.course === 'object' && a.course !== null ? a.course.name : String(a.course ?? '');
          const bCourseName =
            typeof b.course === 'object' && b.course !== null ? b.course.name : String(b.course ?? '');

          return aCourseName.localeCompare(bCourseName);
        } else {
          return a.availability.localeCompare(b.availability);
        }
      });
  };

  return (
    <div className="lecturer-page" style={{ padding: '0', margin: '0' }}>
      <div
        style={{
          backgroundColor: '#e8545c',
          color: '#fff',
          padding: '60px 40px',
          marginBottom: '40px',
          width: '100vw',
          position: 'relative',
          left: '0',
          boxSizing: 'border-box'
        }}
      >
        <h1>Lecturer Dashboard</h1>
        <p style={{ marginTop: '5px' }}>
          Manage and review all tutor and lab assistant applications submitted by students.
        </p>
      </div>

      <div className="filter-sort-bar" style={{ padding: '0 40px' }}>
        <input
          type="text"
          placeholder="Search by name, course, skill, availability..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortField} onChange={(e) => setSortField(e.target.value as any)}>
          <option value="course">Sort by Course</option>
          <option value="availability">Sort by Availability</option>
        </select>
      </div>

      <div style={{ padding: '0 40px', paddingBottom: '60px' }}>
        <table className="applicant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Availability</th>
              <th>Skills</th>
              <th>Credentials</th>
              <th>Application Type</th>
              <th>Rank</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterAndSortApplicants(editedApplicants).map((applicant, index) => (
              <tr key={index}>
                <td>{applicant.fullName}</td>
                <td>
                  {typeof applicant.course === 'string'
                    ? applicant.course
                    : applicant.course
                    ? `${applicant.course.name} (${applicant.course.code})`
                    : 'N/A'}
                </td>
                <td>{applicant.availability}</td>
                <td>{applicant.skills}</td>
                <td>{applicant.academicCredentials}</td>
                <td>{applicant.position || 'N/A'}</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={applicant.rank ?? ''}
                    onChange={(e) => handleRankChange(applicant.id, e.target.value)}
                    className="rank-input"
                  />
                </td>
                <td>
                  <textarea
                    value={applicant.comments ?? ''}
                    onChange={(e) => handleCommentChange(applicant.id, e.target.value)}
                    placeholder="Enter comments..."
                    rows={2}
                    className="comment-box"
                  />
                </td>
                <td>{applicant.status || 'In Progress'}</td>
                <td>
                  <button
                    onClick={() => handleSendComment(applicant)}
                    className="send-comment-btn"
                    style={{
                      backgroundColor: 'green',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Send Comment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lecturer;
