import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Navbar from '../components/Navbar';

const GET_REPORTS = gql`
  query GetReports {
    reports {
      candidatesPerCourse
      overbookedCandidates {
        id
        fullName
        email
      }
      unchosenCandidates {
        id
        fullName
        email
      }
    }
  }
`;

interface Candidate {
  id: number;
  fullName: string;
  email: string;
}

const Reports: React.FC = () => {
  const { data, loading, error } = useQuery(GET_REPORTS);

  if (loading) return <p>Loading reports...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p>Error: {error.message}</p>;
  }

  const {
    candidatesPerCourse,
    overbookedCandidates,
    unchosenCandidates,
  }: {
    candidatesPerCourse: [string, string][];
    overbookedCandidates: Candidate[];
    unchosenCandidates: Candidate[];
  } = data.reports;

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h2 className="heading">Reports</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="heading-cell">
                <h3>Candidates Per Course ({candidatesPerCourse.length})</h3>
              </td>
              <td className="data-cell">
                {candidatesPerCourse.length > 0 ? (
                  <ul className="list">
                    {candidatesPerCourse.map(([course, count]) => (
                      <li key={course}>
                        <strong>{course}:</strong> {count}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No course data available.</p>
                )}
              </td>
            </tr>

            <tr>
              <td className="heading-cell">
                <h3>Overbooked Candidates ({overbookedCandidates.length})</h3>
              </td>
              <td className="data-cell">
                {overbookedCandidates.length > 0 ? (
                  <ul className="list">
                    {overbookedCandidates.map((candidate) => (
                      <li key={candidate.id}>
                        {candidate.fullName} ({candidate.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No overbooked candidates found.</p>
                )}
              </td>
            </tr>

            <tr>
              <td className="heading-cell">
                <h3>Unchosen Candidates ({unchosenCandidates.length})</h3>
              </td>
              <td className="data-cell">
                {unchosenCandidates.length > 0 ? (
                  <ul className="list">
                    {unchosenCandidates.map((candidate) => (
                      <li key={candidate.id}>
                        {candidate.fullName} ({candidate.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No unchosen candidates found.</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
