import { supabase } from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

/* =======================
   Upload Note
======================= */
export const uploadNote = async (req, res, next) => {
  try {
    const file = req.file;
    const { title, subject } = req.body;

    if (!file) {
      return res.status(400).json({ message: "File required" });
    }

    const fileName = `${uuidv4()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("notes")
      .upload(fileName, file.buffer);

    if (uploadError) throw uploadError;

    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/notes/${fileName}`;

    const { error: insertError } = await supabase
      .from("notes")
      .insert({
        title,
        subject,
        file_url: fileUrl,
        uploaded_by: req.user.id,
        verified_status: false,
      });

    if (insertError) throw insertError;

    /* =======================
       ADD +10 CREDITS
    ======================= */

    const { data: user } = await supabase
      .from("users")
      .select("credits")
      .eq("id", req.user.id)
      .single();

    const newCredits = (user?.credits || 0) + 10;

    await supabase
      .from("users")
      .update({ credits: newCredits })
      .eq("id", req.user.id);

    /* =======================
       SAVE TRANSACTION
    ======================= */

    await supabase.from("credit_transactions").insert([
      {
        user_id: req.user.id,
        amount: 10,
        type: "note_upload",
      },
    ]);

    res.json({
      message: "Note uploaded successfully (+10 credits)",
      credits: newCredits,
    });

  } catch (err) {
    next(err);
  }
};

/* =======================
   Public Approved Notes
======================= */
export const getApprovedNotes = async (req, res, next) => {
  try {

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("verified_status", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    next(err);
  }
};

/* =======================
   My Notes
======================= */
export const getMyNotes = async (req, res, next) => {
  try {

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("uploaded_by", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    next(err);
  }
};

/* =======================
   Admin - All Notes
======================= */
export const getAllNotes = async (req, res, next) => {
  try {

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    next(err);
  }
};

/* =======================
   Approve Note
======================= */
export const approveNote = async (req, res, next) => {
  try {

    const { id } = req.params;

    const { error } = await supabase
      .from("notes")
      .update({ verified_status: true })
      .eq("id", id);

    if (error) throw error;

    res.json({
      message: "Note approved successfully",
    });

  } catch (err) {
    next(err);
  }
};