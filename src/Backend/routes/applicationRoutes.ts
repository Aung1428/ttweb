import express from "express";
import { submitApplication, getApplications, updateApplication, generateReports } from "../controllers/applicationController";

const router = express.Router();

// POST /api/applications - Submit an application
router.post("/", submitApplication);

// GET /api/applications - Retrieve all applications
router.get("/", getApplications);

router.post('/update', updateApplication);

router.get('/reports', generateReports);

export default router;
