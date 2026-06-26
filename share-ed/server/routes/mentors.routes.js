import express from "express";
import {
  createMentorProfile,
  getMentors,
  matchMentors,
  aiMatchMentor,
} from "../controllers/mentors.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/* CREATE mentor profile */
router.post("/", verifyToken, createMentorProfile);

/* GET all mentors */
router.get("/", getMentors);

/* Dropdown based AI match */
router.post("/match", verifyToken, matchMentors);

/* Text based AI mentor recommendation */
router.post("/ai-match", verifyToken, aiMatchMentor);

export default router;