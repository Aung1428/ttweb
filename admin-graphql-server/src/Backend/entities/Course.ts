import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { LecturerCourse } from "./LecturerCourse";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column()
  semester!: string;

  @OneToMany(() => LecturerCourse, (lc) => lc.course)
  lecturerCourses!: LecturerCourse[];
}
