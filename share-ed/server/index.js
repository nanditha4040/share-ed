import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import usersRoutes from "./routes/users.routes.js";
import mentorsRoutes from "./routes/mentors.routes.js";
import sessionsRoutes from "./routes/sessions.routes.js";
import aiRoutes from "./routes/ai.routes.js";   // ✅ AI ROUTE

dotenv.config();

const app = express();

/* ========================
   CORS CONFIG
======================== */

app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true
  })
);

/* ========================
   MIDDLEWARE
======================== */

app.use(express.json());

/* ========================
   ROUTES
======================== */

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/mentors", mentorsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/ai", aiRoutes);   // ✅ GEMINI AI ROUTE

/* ========================
   HEALTH CHECK
======================== */

app.get("/", (req, res) => {
  res.send("🚀 Share-Ed backend running");
});

/* ========================
   ERROR HANDLER
======================== */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

/* ========================
   SERVER
======================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});