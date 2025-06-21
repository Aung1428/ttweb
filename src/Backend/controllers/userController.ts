import { Request, Response } from "express";
import { AppDataSource } from "../server";
import bcrypt from "bcrypt";
import { Candidate } from "../entities/Candidate";
import { Lecturer } from "../entities/Lecturer";
import fetch from 'node-fetch';

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { role, fullName, email, password, department } = req.body;

    if (!role || !fullName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "candidate") {
      const candidateRepo = AppDataSource.getRepository(Candidate);
      const existing = await candidateRepo.findOneBy({ email });
      if (existing) return res.status(409).json({ message: "Email already in use" });

      const newCandidate = candidateRepo.create({
        fullName,
        email,
        password: hashedPassword,
      });
      await candidateRepo.save(newCandidate);
      return res.status(201).json({ message: "Candidate account created successfully" });
    }

    if (role === "lecturer") {
      if (!department) {
        return res.status(400).json({ message: "Missing department for lecturer" });
      }

      const lecturerRepo = AppDataSource.getRepository(Lecturer);
      const existing = await lecturerRepo.findOneBy({ email });
      if (existing) return res.status(409).json({ message: "Email already in use" });

      const newLecturer = lecturerRepo.create({
        fullName,
        email,
        password: hashedPassword,
        department,
      });
      await lecturerRepo.save(newLecturer);
      return res.status(201).json({ message: "Lecturer account created successfully" });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signinUser = async (req: Request, res: Response) => {
  const { email, password, captchaToken } = req.body;

  // Step 1: Check token exists
  if (!captchaToken) {
    return res.status(400).json({ message: 'Missing reCAPTCHA token' });
  }

  // Step 2: Verify token with Google
  const isHuman = await verifyRecaptcha(captchaToken);
  if (!isHuman) {
    return res.status(403).json({ message: 'Failed reCAPTCHA verification' });
  }

  try {
    const candidateRepo = AppDataSource.getRepository(Candidate);
    const lecturerRepo = AppDataSource.getRepository(Lecturer);

    let candidate = await candidateRepo.findOneBy({ email });

    if (candidate) {
      if (candidate.isBlocked) {
        return res.status(403).json({ message: "Your account is blocked by the admin." });
      }

      const isPasswordValid = await bcrypt.compare(password, candidate.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, createdAt, ...userWithoutPassword } = candidate;
      return res.status(200).json({ ...userWithoutPassword, joinDate: createdAt, role: "candidate" });
    }

    const lecturer = await lecturerRepo.findOneBy({ email });
    if (!lecturer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, lecturer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: _, createdAt, ...userWithoutPassword } = lecturer;
    return res.status(200).json({ ...userWithoutPassword, joinDate: createdAt, role: "lecturer" });

  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { email, avatar } = req.body;

  if (!email || !avatar) {
    return res.status(400).json({ message: "Missing email or avatar" });
  }

  try {
    const candidateRepo = AppDataSource.getRepository(Candidate);
    const lecturerRepo = AppDataSource.getRepository(Lecturer);

    const candidate = await candidateRepo.findOneBy({ email });
    if (candidate) {
      candidate.avatar = avatar;
      await candidateRepo.save(candidate);
      return res.json({ message: "Avatar updated for candidate" });
    }

    const lecturer = await lecturerRepo.findOneBy({ email });
    if (lecturer) {
      lecturer.avatar = avatar;
      await lecturerRepo.save(lecturer);
      return res.json({ message: "Avatar updated for lecturer" });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await response.json() as { success: boolean; [key: string]: any };

  return data.success;
};
