import express from "express";
import multer from "multer";
import {
  uploadNote,
  getApprovedNotes,
  getMyNotes,
  approveNote,
  getAllNotes,
} from "../controllers/notes.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* Upload note */
router.post("/upload", verifyToken, upload.single("file"), uploadNote);

/* Public approved notes */
router.get("/", getApprovedNotes);

/* Get logged-in user's notes */
router.get("/my", verifyToken, getMyNotes);

/* Admin: get all notes */
router.get("/all", verifyToken, requireRole("admin"), getAllNotes);

/* Admin: approve note */
router.patch("/approve/:id", verifyToken, requireRole("admin"), approveNote);

export default router;