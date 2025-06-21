// src/Backend/entities/Application.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
import { Candidate } from './Candidate';
import { Course } from './Course';

@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  availability!: string;

  @Column()
  skills!: string;

  @Column()
  academicCredentials!: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'candidate_id' })
  candidate!: Candidate;

  @Column({ nullable: true })
  position!: string;

  @Column({ nullable: true })
  rank!: number;

  @Column({ nullable: true })
  comments!: string;

  @Column({ nullable: true })
  status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  submittedAt!: Date;
}
