import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Candidate } from "./entities/Candidate";
import { Lecturer } from "./entities/Lecturer";
import { Application } from "./entities/Application";
import { Course } from "./entities/Course";
import { CandidateCourse } from "./entities/CandidateCourse";
import courseRoutes from './routes/courseRoutes';
import path from "path";
import cors from "cors";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/courses', courseRoutes);

// Setup database connection
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [ Candidate, Lecturer, Application, Course, CandidateCourse],
  synchronize: true,
  logging: true,
});

// Debug log for environment
console.log("Connecting to DB with:");
console.log("  DB_USER:", process.env.DB_USER);
console.log("  DB_NAME:", process.env.DB_NAME);

// Initialize DB and then mount routes
AppDataSource.initialize()
  .then(() => {
    console.log(" Database connected successfully");
    console.log(" AppDataSource.isInitialized =", AppDataSource.isInitialized);

    // Import routes only AFTER DB is initialized
    const userRoutes = require("./routes/userRoutes").default;
    const applicationRoutes = require("./routes/applicationRoutes").default;

    // Setup routes
    app.use("/api/users", userRoutes);
    app.use("/api/applications", applicationRoutes);
    app.use("/api", applicationRoutes);

    // Start server
    app.listen(3001, () => {
      console.log(" Server running on http://localhost:3001");
    });
  })
  .catch((error) => {
    console.error(" Database connection failed:", error);
  });
