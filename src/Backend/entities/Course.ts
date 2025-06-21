import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


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
}
