import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Navbar from '../components/Navbar';

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      code
      name
      semester
    }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($code: String!, $name: String!, $semester: String!) {
    addCourse(code: $code, name: $name, semester: $semester) {
      id
      code
      name
      semester
    }
  }
`;

const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $code: String, $name: String, $semester: String) {
    updateCourse(id: $id, code: $code, name: $name, semester: $semester) {
      id
      code
      name
      semester
    }
  }
`;

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

const CourseManager: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_COURSES);
  const [addCourse] = useMutation(ADD_COURSE);
  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  const [formData, setFormData] = useState({ code: '', name: '', semester: '', id: '' });
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateCourse({ variables: { ...formData, id: formData.id } });
    } else {
      await addCourse({ variables: formData });
    }
    setFormData({ code: '', name: '', semester: '', id: '' });
    setEditing(false);
    refetch();
  };

  const handleEdit = (course: any) => {
    setFormData(course);
    setEditing(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCourse({ variables: { id } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h2 className="heading">Manage Courses</h2>
        <form onSubmit={handleSubmit} className="form center-form">
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Course Code"
            className="form-input small-input"
            required
          />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Course Name"
            className="form-input small-input"
            required
          />
          <input
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            className="form-input small-input"
            required
          />
          <button
            type="submit"
            className="form-button"
          >
            {editing ? 'Update' : 'Add'} Course
          </button>
          <div className="button-space-large"></div>
        </form>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((course: any) => (
                <tr key={course.id} className="hover-row">
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.semester}</td>
                  <td className="action-cell">
                    <button
                      onClick={() => handleEdit(course)}
                      className="action-button edit-button"
                    >
                      Edit
                    </button>
                    <span className="button-space"></span>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="action-button delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseManager;
