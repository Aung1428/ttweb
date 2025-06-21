import express from "express";
import {
  signupUser,
  signinUser,
  updateAvatar,
} from "../controllers/userController";
import { AppDataSource } from "../server";
import { Candidate } from "../entities/Candidate";
import { Lecturer } from "../entities/Lecturer";

const router = express.Router();

// Authentication routes
router.post("/signup", signupUser);
router.post("/signin", signinUser);

// Avatar update route
router.put("/update-avatar", updateAvatar); // ✅ Clean controller delegation

// Optional: Add block/unblock routes here (for admin use)
router.put("/block-candidate", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });

  try {
    const repo = AppDataSource.getRepository(Candidate);
    const candidate = await repo.findOneBy({ email });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    candidate.isBlocked = true;
    await repo.save(candidate);
    return res.status(200).json({ message: "Candidate blocked successfully" });
  } catch (err) {
    console.error("Error blocking candidate:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/unblock-candidate", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });

  try {
    const repo = AppDataSource.getRepository(Candidate);
    const candidate = await repo.findOneBy({ email });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    candidate.isBlocked = false;
    await repo.save(candidate);
    return res.status(200).json({ message: "Candidate unblocked successfully" });
  } catch (err) {
    console.error("Error unblocking candidate:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
