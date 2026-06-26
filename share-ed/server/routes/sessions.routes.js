import express from "express";
import { supabase } from "../config/supabaseClient.js";

const router = express.Router();

/* ========================
   BOOK SESSION
======================== */
router.post("/", async (req, res) => {
  try {
    const { learner_id, mentor_id, subject } = req.body;

    if (!learner_id || !mentor_id) {
      return res.status(400).json({
        message: "Learner ID and Mentor ID are required",
      });
    }

    // Get learner credits
    const { data: learner, error: learnerError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", learner_id)
      .single();

    if (learnerError || !learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    if (learner.credits < 10) {
      return res.status(400).json({
        message: "Not enough credits. Need 10 credits to book session",
      });
    }

    // Create session
    const { data: session, error } = await supabase
      .from("sessions")
      .insert([
        {
          learner_id,
          mentor_id,
          subject,
          session_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json(error);
    }

    // Deduct credits
    await supabase
      .from("users")
      .update({ credits: learner.credits - 10 })
      .eq("id", learner_id);

    // Log transaction
    await supabase.from("credit_transactions").insert([
      {
        user_id: learner_id,
        amount: -10,
        type: "session_booking",
        related_session_id: session.id,
      },
    ]);

    res.json({
      message: "Session booked successfully",
      session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ========================
   GET LEARNER SESSIONS
======================== */
router.get("/learner/:learner_id", async (req, res) => {
  try {
    const { learner_id } = req.params;

    const { data, error } = await supabase
      .from("sessions")
      .select(`*, mentor:mentor_id (name,email)`)
      .eq("learner_id", learner_id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json(error);

    const sessions = data.map((s) => ({
      ...s,
      mentor_name: s.mentor?.name || s.mentor?.email || "Unknown",
    }));

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ========================
   GET MENTOR SESSIONS
======================== */
router.get("/mentor/:mentor_id", async (req, res) => {
  try {
    const { mentor_id } = req.params;

    const { data, error } = await supabase
      .from("sessions")
      .select(`*, learner:learner_id (name,email)`)
      .eq("mentor_id", mentor_id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json(error);

    const sessions = data.map((s) => ({
      ...s,
      learner_name: s.learner?.name || s.learner?.email || "Unknown",
    }));

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ========================
   UPDATE SESSION STATUS
======================== */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { session_status } = req.body;

    const allowed = ["accepted", "rejected", "completed"];

    if (!allowed.includes(session_status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowed.join(", ")}`,
      });
    }

    const { data: session } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const { data: updated } = await supabase
      .from("sessions")
      .update({ session_status })
      .eq("id", id)
      .select()
      .single();

    // Give mentor credits when session completed
    if (session_status === "completed" && session.session_status !== "completed") {
      const { data: mentor } = await supabase
        .from("users")
        .select("credits")
        .eq("id", session.mentor_id)
        .single();

      await supabase
        .from("users")
        .update({ credits: (mentor.credits || 0) + 10 })
        .eq("id", session.mentor_id);

      await supabase.from("credit_transactions").insert([
        {
          user_id: session.mentor_id,
          amount: 10,
          type: "session_complete",
          related_session_id: id,
        },
      ]);
    }

    res.json({ session: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;