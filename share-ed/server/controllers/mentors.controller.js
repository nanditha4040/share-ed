import { supabase } from "../config/supabaseClient.js";

/* CREATE mentor profile */
export const createMentorProfile = async (req, res, next) => {
  try {
    const { subject, proficiency, availability } = req.body;
    const userId = req.user.id;

    const { data: existing } = await supabase
      .from("peer_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existing) {
      return res.status(400).json({
        message: "You are already registered as a mentor",
      });
    }

    const { data, error } = await supabase
      .from("peer_profiles")
      .insert({
        user_id: userId,
        subject,
        proficiency,
        availability,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* GET all mentors */
export const getMentors = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("peer_profiles")
      .select("*");

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* SUBJECT BASED MATCH (dropdown version) */
export const matchMentors = async (req, res, next) => {
  try {
    const { subject } = req.body;

    const { data, error } = await supabase
      .from("peer_profiles")
      .select("*")
      .ilike("subject", `%${subject}%`);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.json([]);
    }

    const rank = {
      Expert: 4,
      Advanced: 3,
      Intermediate: 2,
      Beginner: 1,
    };

    const sorted = data.sort(
      (a, b) => (rank[b.proficiency] || 0) - (rank[a.proficiency] || 0)
    );

    res.json([sorted[0]]);
  } catch (err) {
    next(err);
  }
};

/* AI QUERY BASED MATCH */
export const aiMatchMentor = async (req, res, next) => {
  try {
    const { query } = req.body;

    const text = query.toLowerCase();
    let subject = null;

    // DATA STRUCTURES
    if (
      text.includes("recursion") ||
      text.includes("tree") ||
      text.includes("linked list") ||
      text.includes("stack") ||
      text.includes("queue")
    ) {
      subject = "Data Structures";
    }

    // MACHINE LEARNING
    if (
      text.includes("machine learning") ||
      text.includes("model") ||
      text.includes("prediction") ||
      text.includes("neural")
    ) {
      subject = "Machine Learning";
    }

    // DBMS
    if (
      text.includes("database") ||
      text.includes("data base") ||
      text.includes("sql") ||
      text.includes("query") ||
      text.includes("queries") ||
      text.includes("join") ||
      text.includes("table") ||
      text.includes("normalization") ||
      text.includes("dbms")
    ) {
      subject = "DBMS";
    }

    // fallback
    if (!subject) {
      subject = "Data Structures";
    }

    const { data, error } = await supabase
      .from("peer_profiles")
      .select("*")
      .ilike("subject", `%${subject}%`);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.json(null);
    }

    const rank = {
      Expert: 4,
      Advanced: 3,
      Intermediate: 2,
      Beginner: 1,
    };

    const bestMentor = data.sort(
      (a, b) => (rank[b.proficiency] || 0) - (rank[a.proficiency] || 0)
    )[0];

    res.json(bestMentor);

  } catch (err) {
    next(err);
  }
};