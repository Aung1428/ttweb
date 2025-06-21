import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Course } from "./Course";

@Entity()
export class CandidateCourse {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Candidate, { onDelete: "CASCADE" })
  @JoinColumn({ name: "candidateId" })
  candidate!: Candidate;

  @ManyToOne(() => Course, { onDelete: "CASCADE" })
  @JoinColumn({ name: "courseId" })
  course!: Course;
}
