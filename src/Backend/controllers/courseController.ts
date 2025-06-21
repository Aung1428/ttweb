import { Request, Response } from 'express';
import { AppDataSource } from '../server';
import { Course } from '../entities/Course';

export const getCourses = async (_req: Request, res: Response) => {
  try {
    const courseRepo = AppDataSource.getRepository(Course);
    const courses = await courseRepo.find();
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error loading courses:', err);
    res.status(500).json({ message: 'Failed to load courses' });
  }
};
