import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Get logged-in user (credits) */
router.get("/me", verifyToken, async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("users")
      .select("credits")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;