import { useEffect, useState } from "react";
import api from "../api";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [subject, setSubject] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchMentors();
  }, []);

  const filterSelf = (mentorList) => {
    return mentorList.filter((mentor) => {
      const mentorId = mentor.user_id ?? mentor.users?.id ?? mentor.id;
      return mentorId !== userId;
    });
  };

  const fetchMentors = async () => {
    try {
      const res = await api.get("/mentors");

      const mentorList = res.data.mentors || res.data || [];

      // remove current user from mentors list
      const filtered = filterSelf(mentorList);

      setMentors(filtered);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    }

    setLoading(false);
  };

  const findMentors = async () => {
    try {
      const res = await api.post("/mentors/match", {
        subject: subject,
      });

      const filtered = filterSelf(res.data);

      setMentors(filtered);
    } catch (error) {
      console.error("Error matching mentors:", error);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const bookSession = async (mentor) => {
    setBookingId(mentor.id);

    try {
      const learner_id = localStorage.getItem("user_id");

      if (!learner_id) {
        showToast("You must be logged in to book a session.", "error");
        return;
      }

      const mentor_id = mentor.user_id ?? mentor.users?.id ?? mentor.id;

      await api.post("/sessions", {
        learner_id,
        mentor_id,
        subject: mentor.subject,
      });

      showToast(`Session requested with ${mentor.subject} mentor! 🎉`);
    } catch (err) {
      console.error("Error booking session:", err);
      showToast(
        err.response?.data?.message || "Could not book session.",
        "error"
      );
    }

    setBookingId(null);
  };

  const LEVEL_COLORS = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-orange-100 text-orange-700",
    expert: "bg-purple-100 text-purple-700",
  };

  return (
    <div>
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold
          ${
            toast.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-1 text-slate-700">
        Find a Mentor
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Book a session with a peer mentor. Costs 10 credits.
      </p>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter subject (example: DBMS)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={findMentors}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Find AI Mentor
        </button>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-64 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="text-5xl mb-3">🎓</div>
          <h3 className="font-semibold text-slate-700 mb-1">No mentors yet</h3>
          <p className="text-sm text-gray-400">Check back soon!</p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="min-w-[280px] bg-white rounded-2xl shadow-md p-6 flex flex-col"
            >
              <div className="h-16 w-16 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-slate-500">
                {mentor.subject?.[0]?.toUpperCase() || "?"}
              </div>

              <h3 className="text-lg font-semibold text-slate-700 mb-1">
                {mentor.users?.name || mentor.name || "Anonymous"}
              </h3>

              <p className="text-slate-500 text-sm mb-1">
                📚 {mentor.subject}
              </p>

              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full w-fit mb-1 ${
                  LEVEL_COLORS[mentor.proficiency_level] ||
                  "bg-slate-100 text-slate-600"
                }`}
              >
                {mentor.proficiency_level}
              </span>

              <p className="text-sm text-slate-400 mb-4">
                🕒 {mentor.availability || "Flexible"}
              </p>

              <button
                onClick={() => bookSession(mentor)}
                disabled={bookingId === mentor.id}
                className="mt-auto bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 text-sm font-semibold"
              >
                {bookingId === mentor.id ? "Booking..." : "Book Session"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}