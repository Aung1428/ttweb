TT WebSystem

A full-featured role-based web application for job mentoring at RMIT, enabling users to apply for Tutor or Lab Assistant positions and lecturers to review, rank, and manage applications.

---

Key Features

Authentication
- Modal-based Sign In / Sign Up (role-specific)
- Password strength indicator and validation
- RMIT email verification for lecturers
- Role selection during signup (Tutor or Lecturer)

Tutor View
- Apply for Tutor or Lab Assistant roles
- Resume-like form with validation
- View application status in modal popup
- Verify submitted application before final submission

Lecturer View
- Lecturer Dashboard to:
  - View and filter student applications
  - Sort by course or availability
  - Rank applicants and leave comments
  - Auto-assign status based on comments (Accepted, Rejected, In Progress)
- Access to reports (placeholder)
- View personal profile info


Public Pages
- Home: Image slider with a "Get Started" CTA
- About: Highlights platform benefits for Tutors and Lecturers
- Contact: Contact form and icon-based details
- Header/Footer: Fully responsive navigation and legal footer

---

Tech Stack
- Frontend: React + TypeScript
- UI: CSS Modules, React Icons
- Routing: React Router DOM
- State Management: React Hooks, Context API

Image Design Tools
  - Microsoft Designer
  - Canva

---
Getting Started

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

Setup Instructions
# Clone the repository
git clone https://github.com/rmit-fsd-2025-s1/s4031289-s3960706-a2.git
cd s4031289-s3960706-a2

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
   npx ts-node --project src/Backend/tsconfig.json src/Backend/server.ts
   ```
   This will start the backend server.
