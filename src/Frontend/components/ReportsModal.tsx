import React, { ComponentType, useState, useEffect } from 'react';
import { FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicantData {
  name: string;
  course: { id: number; code: string; name: string; semester: string } | string | null;
  applicationType: string;
  comments: string;
  rank?: number;
  status?: string;
}

const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [reportData, setReportData] = useState<{
    mostChosen: ApplicantData[];
    leastChosen: ApplicantData[];
    rejected: ApplicantData[];
  }>({
    mostChosen: [],
    leastChosen: [],
    rejected: []
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/reports')
        .then(res => res.json())
        .then(data => setReportData(data))
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const CloseIcon = FaTimes as ComponentType<IconBaseProps>;
  const ChevronUpIcon = FaChevronUp as ComponentType<IconBaseProps>;
  const ChevronDownIcon = FaChevronDown as ComponentType<IconBaseProps>;

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const formatStatus = (status: string) => {
    if (!status) return '';
    return status
      .split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderTable = (data: ApplicantData[], sortOrder: 'asc' | 'desc') => {
    const sortedData = [...data].sort((a, b) => {
      const rankA = a.rank ?? 0;
      const rankB = b.rank ?? 0;
      return sortOrder === 'asc' ? rankA - rankB : rankB - rankA;
    });

    return (
      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Application Type</th>
              <th>Comments</th>
              {sortedData[0]?.rank !== undefined && <th>Rank</th>}
              {sortedData[0]?.status && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>
                  {typeof item.course === 'string'
                    ? item.course
                    : item.course
                    ? `${item.course.name} (${item.course.code})`
                    : '—'}
                </td>
                <td>{item.applicationType}</td>
                <td>{item.comments || '—'}</td>
                <td>{item.rank !== undefined ? item.rank : '—'}</td>
                <td>{formatStatus(item.status || '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content reports-modal">
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>
        <h2>Applicant Reports</h2>

        <div className="reports-container">
          <div className="accordion-section">
            <button 
              className={`accordion-header ${activeAccordion === 'mostChosen' ? 'active' : ''}`}
              onClick={() => toggleAccordion('mostChosen')}
            >
              <span>Most Chosen Applicants ({reportData.mostChosen.length})</span>
              {activeAccordion === 'mostChosen' ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {activeAccordion === 'mostChosen' && renderTable(reportData.mostChosen, 'asc')}
          </div>

          <div className="accordion-section">
            <button 
              className={`accordion-header ${activeAccordion === 'leastChosen' ? 'active' : ''}`}
              onClick={() => toggleAccordion('leastChosen')}
            >
              <span>Least Chosen Applicants ({reportData.leastChosen.length})</span>
              {activeAccordion === 'leastChosen' ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {activeAccordion === 'leastChosen' && renderTable(reportData.leastChosen, 'desc')}
          </div>

          <div className="accordion-section">
            <button 
              className={`accordion-header ${activeAccordion === 'rejected' ? 'active' : ''}`}
              onClick={() => toggleAccordion('rejected')}
            >
              <span>Rejected Applicants ({reportData.rejected.length})</span>
              {activeAccordion === 'rejected' ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {activeAccordion === 'rejected' && renderTable(reportData.rejected, 'asc')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
