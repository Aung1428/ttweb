import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Course } from "./Course";

@Entity()
export class LecturerCourse {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Lecturer, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lecturerId" })
  lecturer!: Lecturer;

  @ManyToOne(() => Course, { onDelete: "CASCADE" })
  @JoinColumn({ name: "courseId" })
  course!: Course;
}
