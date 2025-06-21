import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Navbar from '../components/Navbar';

const GET_CANDIDATES = gql`
  query {
    candidates {
      id
      fullName
      email
      isBlocked
    }
  }
`;

const BLOCK_CANDIDATE = gql`
  mutation($candidateId: ID!) {
    blockCandidate(candidateId: $candidateId) {
      id
      isBlocked
    }
  }
`;

const UNBLOCK_CANDIDATE = gql`
  mutation($candidateId: ID!) {
    unblockCandidate(candidateId: $candidateId) {
      id
      isBlocked
    }
  }
`;

const BlockCandidates: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_CANDIDATES);
  const [blockCandidate] = useMutation(BLOCK_CANDIDATE);
  const [unblockCandidate] = useMutation(UNBLOCK_CANDIDATE);

  const handleToggle = async (candidate: any) => {
    if (candidate.isBlocked) {
      await unblockCandidate({ variables: { candidateId: candidate.id } });
    } else {
      await blockCandidate({ variables: { candidateId: candidate.id } });
    }
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading candidates.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded">
        <h2 className="heading">Block Candidates</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.candidates.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>
                  {c.isBlocked ? 'Blocked' : 'Active'}
                </td>
                <td>
                  <button
                    onClick={() => handleToggle(c)}
                    className={`action-button ${
                      c.isBlocked ? 'edit-button' : 'delete-button'
                    }`}
                  >
                    {c.isBlocked ? 'Unblock' : 'Block'}
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

export default BlockCandidates;
