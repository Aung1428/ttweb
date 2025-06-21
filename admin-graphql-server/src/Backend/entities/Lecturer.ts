import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Lecturer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  department!: string;

  @Column({ nullable: true })
  avatar!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
