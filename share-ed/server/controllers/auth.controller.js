import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";

/* =======================
   REGISTER
======================= */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data?.user) {
      return res.status(400).json({
        message: error?.message || "User creation failed",
      });
    }

    const finalRole = role?.toLowerCase() || "student";

    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: data.user.id,
        name,
        email,
        role: finalRole,
        credits: 50,          // starter credits
        last_login: null
      });

    if (insertError) {
      return res.status(400).json({
        message: insertError.message,
      });
    }

    const token = jwt.sign(
      { id: data.user.id, role: finalRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: data.user.id,
        role: finalRole,
        credits: 50
      },
    });

  } catch (err) {
    next(err);
  }
};

/* =======================
   LOGIN
======================= */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError || !user) {
      return res.status(403).json({
        message: "User not registered in Share-Ed",
      });
    }

    /* =======================
       DAILY LOGIN CREDIT
    ======================= */

    const today = new Date().toISOString().split("T")[0];

    if (!user.last_login || user.last_login !== today) {

      const newCredits = (user.credits || 0) + 5;

      await supabase
        .from("users")
        .update({
          credits: newCredits,
          last_login: today
        })
        .eq("id", user.id);

      user.credits = newCredits;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        credits: user.credits
      },
    });

  } catch (err) {
    next(err);
  }
};