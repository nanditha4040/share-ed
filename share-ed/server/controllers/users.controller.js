import { supabase } from "../config/supabaseClient.js";

export const getCurrentUser = async (req, res, next) => {
  try {

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    res.json({
      credits: user.credits || 0,
      history: []
    });

  } catch (err) {
    next(err);
  }
};