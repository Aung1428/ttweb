# User Guide for Admin Dashboard

This guide provides information on how to use the Admin Dashboard, including managing candidates, lecturers, and accessing reports.

## Features

- **Candidates Management**: View and manage candidates for courses.
- **Lecturers Management**: Assign and manage lecturers for courses.
- **Reports**: Access detailed reports on course enrollments and candidate status.

## Starting the Application

### Prerequisites

- Node.js
- npm

### Commands

1. **Start Frontend**:
   Navigate to the frontend directory and run:
   ```bash
   npm start
   ```
   This will start the React frontend on [http://localhost:3000](http://localhost:3000).

2. **Start Backend**:
   Navigate to the backend directory and run:
   ```bash
   npx ts-node -r tsconfig-paths/register src/server.ts
   ```
   This will start the GraphQL backend server.

## Usage

- **Manage Courses**: Add, update, and delete courses.
- **Assign Lecturers**: Assign lecturers to specific courses.
- **Block Candidates**: Block candidates from enrolling in courses.
- **View Reports**: Access reports on candidates and course statistics.

## Learn More

- [React documentation](https://reactjs.org/)
- [GraphQL documentation](https://graphql.org/learn/)
