import { Request, Response } from 'express';
import { AppDataSource } from '../server';
import { Application } from '../entities/Application';
import { Course } from '../entities/Course';
import { Candidate } from '../entities/Candidate';
import { CandidateCourse } from '../entities/CandidateCourse';

export const submitApplication = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    availability,
    skills,
    academicCredentials,
    course,
    position,
  } = req.body;

  console.log('🛠️ Incoming Application:', req.body);

  const errors: { [key: string]: string } = {};
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!fullName?.trim()) errors.fullName = 'Full Name is required.';
  if (!email?.trim()) errors.email = 'Email is required.';
  else if (!gmailRegex.test(email)) errors.email = 'Please use a valid Gmail address.';
  if (!availability) errors.availability = 'Availability is required.';
  if (!skills?.trim()) errors.skills = 'Skills are required.';
  if (!academicCredentials?.trim()) errors.academicCredentials = 'Academic credentials required.';
  if (!course) errors.course = 'Course is required.';
  if (!position) errors.position = 'Position is required.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const courseRepo = AppDataSource.getRepository(Course);
    const candidateRepo = AppDataSource.getRepository(Candidate);
    const applicationRepo = AppDataSource.getRepository(Application);
    const candidateCourseRepo = AppDataSource.getRepository(CandidateCourse);

    const courseEntity = await courseRepo.findOneBy({ code: course });
    if (!courseEntity) {
      return res.status(400).json({ message: 'Course not found.' });
    }

    let candidateEntity = await candidateRepo.findOneBy({ email });
    if (!candidateEntity) {
      candidateEntity = candidateRepo.create({ fullName, email });
      await candidateRepo.save(candidateEntity);
    }

    // ✅ Link candidate to course if not already linked
    const existingCandidateCourse = await candidateCourseRepo.findOne({
      where: {
        candidate: { id: candidateEntity.id },
        course: { id: courseEntity.id }
      },
      relations: ['candidate', 'course']
    });

    if (!existingCandidateCourse) {
      const link = candidateCourseRepo.create({
        candidate: candidateEntity,
        course: courseEntity
      });
      await candidateCourseRepo.save(link);
    }

    const newApp = applicationRepo.create({
      fullName,
      email,
      availability,
      skills,
      academicCredentials,
      course: courseEntity,
      candidate: candidateEntity,
      position,
    });

    const result = await applicationRepo.save(newApp);
    return res.status(201).json(result);

  } catch (err: any) {
    console.error(' Error saving application:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string | undefined;
    const applicationRepo = AppDataSource.getRepository(Application);

    const apps = await applicationRepo.find({
      where: email ? { email } : {},
      order: { submittedAt: 'DESC' },
      relations: ['course'],
    });

    return res.status(200).json(apps);
  } catch (err) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  const { id, rank, comments, status } = req.body;

  if (!id) return res.status(400).json({ message: 'Application ID is required.' });

  try {
    const applicationRepo = AppDataSource.getRepository(Application);
    const application = await applicationRepo.findOneBy({ id });

    if (!application) return res.status(404).json({ message: 'Application not found.' });

    application.rank = rank ?? application.rank;
    application.comments = comments ?? application.comments;
    application.status = status ?? application.status;

    const result = await applicationRepo.save(application);
    return res.status(200).json(result);

  } catch (err) {
    console.error(' Update error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const generateReports = async (_req: Request, res: Response) => {
  try {
    const applicationRepo = AppDataSource.getRepository(Application);
    const apps = await applicationRepo.find({
      relations: ['course'],
      order: { submittedAt: 'DESC' }
    });

    const mostChosen = apps
      .filter(app => app.rank != null)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
      .slice(0, 5)
      .map(app => ({
        name: app.fullName,
        course: app.course,
        applicationType: app.position ?? 'N/A',
        comments: app.comments ?? '',
        rank: app.rank,
        status: app.status ?? 'In Progress'
      }));

    const leastChosen = apps
      .filter(app => app.rank != null)
      .sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0))
      .slice(0, 5)
      .map(app => ({
        name: app.fullName,
        course: app.course,
        applicationType: app.position ?? 'N/A',
        comments: app.comments ?? '',
        rank: app.rank,
        status: app.status ?? 'In Progress'
      }));

    const rejected = apps
      .filter(app => app.status?.toLowerCase() === 'rejected')
      .map(app => ({
        name: app.fullName,
        course: app.course,
        applicationType: app.position ?? 'N/A',
        comments: app.comments ?? '',
        rank: app.rank,
        status: app.status
      }));

    return res.status(200).json({
      mostChosen,
      leastChosen,
      rejected
    });

  } catch (err) {
    console.error(' Error generating reports:', err);
    return res.status(500).json({ message: 'Error generating reports' });
  }
};
