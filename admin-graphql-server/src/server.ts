import 'reflect-metadata';
import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { AppDataSource } from './db';
import { Course } from './Backend/entities/Course';
import { Lecturer } from './Backend/entities/Lecturer';
import { Candidate } from './Backend/entities/Candidate';
import { LecturerCourse } from './Backend/entities/LecturerCourse';
import { Admin } from './Backend/entities/Admin';
import { gql } from 'graphql-tag';

// Define your typeDefs
const typeDefs = gql`
  type Course {
    id: ID!
    code: String!
    name: String!
    semester: String!
  }

  type Lecturer {
    id: ID!
    fullName: String!
    email: String!
  }

  type Candidate {
    id: ID!
    fullName: String!
    email: String!
    isBlocked: Boolean!
  }

  type Report {
    candidatesPerCourse: [[String]]!
    overbookedCandidates: [Candidate!]!
    unchosenCandidates: [Candidate!]!
  }

  type Query {
    courses: [Course!]!
    lecturers: [Lecturer!]!
    candidates: [Candidate!]!
    reports: Report!
  }

    type Mutation {
    login(username: String!, password: String!): Boolean!
    addCourse(code: String!, name: String!, semester: String!): Course!
    updateCourse(id: ID!, code: String, name: String, semester: String): Course!
    deleteCourse(id: ID!): Boolean!
    assignLecturer(courseId: ID!, lecturerId: ID!): Boolean!
    blockCandidate(candidateId: ID!): Candidate!
    unblockCandidate(candidateId: ID!): Candidate!
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    courses: async () => {
      const repo = AppDataSource.getRepository(Course);
      return repo.find();
    },
    lecturers: async () => {
      const repo = AppDataSource.getRepository(Lecturer);
      return repo.find();
    },
    candidates: async () => {
      const repo = AppDataSource.getRepository(Candidate);
      return repo.find();
    },
    reports: async () => {
      const rawPerCourse = await AppDataSource.query(`
        SELECT c.name AS course, GROUP_CONCAT(a.fullName) AS candidates
        FROM candidate_course cc
        JOIN candidate a ON a.id = cc.candidateId
        JOIN course c ON c.id = cc.courseId
        GROUP BY c.name
      `);

      const overbooked = await AppDataSource.query(`
        SELECT a.* FROM candidate a
        JOIN candidate_course cc ON a.id = cc.candidateId
        GROUP BY a.id
        HAVING COUNT(DISTINCT cc.courseId) > 3
      `);

      const unchosen = await AppDataSource.query(`
        SELECT * FROM candidate
        WHERE id NOT IN (SELECT DISTINCT candidateId FROM candidate_course)
      `);

      return {
        candidatesPerCourse: rawPerCourse.map((r: any) => [r.course, r.candidates]),
        overbookedCandidates: overbooked,
        unchosenCandidates: unchosen,
      };
    },
  },

  Mutation: {
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      const repo = AppDataSource.getRepository(Admin);
      const admin = await repo.findOneBy({ username, password });
      return !!admin;
    },
    addCourse: async (_: any, { code, name, semester }: { code: string; name: string; semester: string }) => {
      const repo = AppDataSource.getRepository(Course);
      const course = repo.create({ code, name, semester });
      return repo.save(course);
    },
    updateCourse: async (_: any, { id, code, name }: { id: number; code?: string; name?: string }) => {
      const repo = AppDataSource.getRepository(Course);
      const course = await repo.findOneBy({ id });
      if (!course) throw new Error("Course not found");
      if (code) course.code = code;
      if (name) course.name = name;
      return repo.save(course);
    },
    deleteCourse: async (_: any, { id }: { id: number }) => {
      const repo = AppDataSource.getRepository(Course);
      const result = await repo.delete(id);
      return (result.affected ?? 0) > 0;
    },
    assignLecturer: async (_: any, { courseId, lecturerId }: { courseId: number; lecturerId: number }) => {
      const courseRepo = AppDataSource.getRepository(Course);
      const lecturerRepo = AppDataSource.getRepository(Lecturer);
      const lecturerCourseRepo = AppDataSource.getRepository(LecturerCourse);

      const course = await courseRepo.findOneBy({ id: courseId });
      const lecturer = await lecturerRepo.findOneBy({ id: lecturerId });

      if (!course || !lecturer) {
        throw new Error("Course or Lecturer not found");
      }

      const assignment = lecturerCourseRepo.create({ course, lecturer });
      await lecturerCourseRepo.save(assignment);
      return true;
    },
    blockCandidate: async (_: any, { candidateId }: { candidateId: number }) => {
      const repo = AppDataSource.getRepository(Candidate);
      const candidate = await repo.findOneBy({ id: candidateId });
      if (!candidate) throw new Error("Candidate not found");
      candidate.isBlocked = true;
      return repo.save(candidate);
    },
    unblockCandidate: async (_: any, { candidateId }: { candidateId: number }) => {
      const repo = AppDataSource.getRepository(Candidate);
      const candidate = await repo.findOneBy({ id: candidateId });
      if (!candidate) throw new Error("Candidate not found");
      candidate.isBlocked = false;
      return repo.save(candidate);
    },
  },
};

console.log(' Connecting with DB_USER:', process.env.DB_USER);
console.log(' Connecting with DB_PASSWORD:', process.env.DB_PASSWORD ? 'set' : 'NOT SET');


// Initialize Yoga + Server
const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  cors: {
    origin: '*',
    credentials: true,
  },
});

const server = createServer(yoga);

// Connect DB then start server
AppDataSource.initialize().then(() => {
  server.listen(4000, () => {
    console.log('Admin GraphQL Server running at http://localhost:4000/graphql');
  });
}).catch((err) => {
  console.error('Failed to connect to DB:', err);
});
