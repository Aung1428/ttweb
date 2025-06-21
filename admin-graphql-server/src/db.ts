import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Course } from './Backend/entities/Course';
import { Lecturer } from './Backend/entities/Lecturer';
import { Candidate } from './Backend/entities/Candidate';
import { Admin } from './Backend/entities/Admin';
import { LecturerCourse } from './Backend/entities/LecturerCourse';
import { CandidateCourse } from './Backend/entities/CandidateCourse';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '209.38.26.237',
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Course,
    Lecturer,
    Candidate,
    Admin,
    LecturerCourse,
    CandidateCourse
  ],
  synchronize: true,
  logging: true,
});
