import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Navbar from '../components/Navbar';

const GET_COURSES_AND_LECTURERS = gql`
  query GetCoursesAndLecturers {
    courses {
      id
      name
    }
    lecturers {
      id
      fullName
    }
  }
`;

const ASSIGN_LECTURER = gql`
  mutation AssignLecturer($courseId: ID!, $lecturerId: ID!) {
    assignLecturer(courseId: $courseId, lecturerId: $lecturerId)
  }
`;

const AssignLecturer: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_COURSES_AND_LECTURERS);
  const [assignLecturer] = useMutation(ASSIGN_LECTURER);

  const [courseId, setCourseId] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [message, setMessage] = useState('');

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !lecturerId) return;
    try {
      await assignLecturer({ variables: { courseId, lecturerId } });
      setMessage('Lecturer assigned successfully.');
      setCourseId('');
      setLecturerId('');
      refetch();
    } catch (err) {
      setMessage('Failed to assign lecturer.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
        <h2 className="heading">Assign Lecturer to Course</h2>
        <form onSubmit={handleAssign} className="form">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Course</option>
            {data.courses.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={lecturerId}
            onChange={(e) => setLecturerId(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Lecturer</option>
            {data.lecturers.map((l: any) => (
              <option key={l.id} value={l.id}>{l.fullName}</option>
            ))}
          </select>

          <button type="submit" className="form-button">
            Assign Lecturer
          </button>
        </form>
        {message && <p className="mt-4 text-blue-600">{message}</p>}
      </div>
    </div>
  );
};

export default AssignLecturer;
