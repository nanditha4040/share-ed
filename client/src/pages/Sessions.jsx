import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const STATUS_STYLES = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "⏳ Pending" },
  accepted: { bg: "bg-green-100", text: "text-green-700", label: "✅ Accepted" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "❌ Rejected" },
  completed: { bg: "bg-purple-100", text: "text-purple-700", label: "🎓 Completed" },
};

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Sessions() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [mentorSessions, setMentorSessions] = useState([]);
  const [tab, setTab] = useState("learner");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);

    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      const learnerRes = await api.get(`/sessions/learner/${user_id}`);
      setSessions(learnerRes.data.sessions || []);

      const mentorRes = await api.get(`/sessions/mentor/${user_id}`);
      setMentorSessions(mentorRes.data.sessions || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }

    setLoading(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (sessionId, status) => {
    setActionLoading((prev) => ({ ...prev, [sessionId]: true }));

    try {
      await api.patch(`/sessions/${sessionId}`, {
        session_status: status,
      });

      if (tab === "mentor") {
        setMentorSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, session_status: status } : s
          )
        );
      } else {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, session_status: status } : s
          )
        );
      }

      showToast(
        status === "accepted"
          ? "Session accepted! ✅"
          : status === "rejected"
          ? "Session rejected."
          : status === "completed"
          ? "Session complete! Credits awarded 🎓"
          : "Session updated."
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Something went wrong.",
        "error"
      );
    }

    setActionLoading((prev) => ({ ...prev, [sessionId]: false }));
  };

  const currentList = tab === "learner" ? sessions : mentorSessions;

  const grouped = {
    pending: currentList.filter((s) => s.session_status === "pending"),
    accepted: currentList.filter((s) => s.session_status === "accepted"),
    completed: currentList.filter((s) => s.session_status === "completed"),
    rejected: currentList.filter((s) => s.session_status === "rejected"),
  };

  return (
    <div className="max-w-3xl mx-auto">

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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold text-slate-700">
          My Sessions
        </h2>

        {tab === "mentor" && (
          <button
            onClick={() => navigate("/become-mentor")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Create Session
          </button>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Track and manage your mentoring sessions.
      </p>

      {/* TAB SWITCH */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "learner", label: `📖 As Learner (${sessions.length})` },
          { key: "mentor", label: `🎓 As Mentor (${mentorSessions.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${
                tab === t.key
                  ? "bg-slate-700 text-white shadow"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : currentList.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">

          <div className="text-5xl mb-3">📅</div>

          <h3 className="font-semibold text-slate-700 mb-1">
            No sessions yet
          </h3>

          <p className="text-sm text-gray-400 mb-4">
            {tab === "learner"
              ? "Book a session from the Mentors page."
              : "Create your first mentoring session."}
          </p>

          {tab === "mentor" && (
            <button
              onClick={() => navigate("/become-mentor")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Create Session
            </button>
          )}

        </div>

      ) : (

        <div className="space-y-6">
          {Object.entries(grouped)
            .filter(([, list]) => list.length > 0)
            .map(([status, list]) => {

              const style = STATUS_STYLES[status];

              return (
                <div key={status}>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>

                    <div className="flex-1 h-px bg-slate-100" />

                    <span className="text-xs text-gray-400">
                      {list.length} session{list.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-3">

                    {list.map((session) => (
                      <div
                        key={session.id}
                        className="bg-white shadow-sm border border-slate-100 rounded-xl p-4 flex items-center gap-4"
                      >

                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold ${style.bg} ${style.text}`}>
                          {(tab === "learner"
                            ? session.mentor_name
                            : session.learner_name)?.[0]?.toUpperCase() || "?"}
                        </div>

                        <div className="flex-1">

                          <div className="font-semibold text-slate-700 text-sm">
                            {session.subject || "General"}
                          </div>

                          <div className="text-xs text-gray-400 mt-1 flex gap-3">

                            <span>
                              {tab === "learner" ? "🎓 Mentor: " : "📖 Learner: "}
                              {tab === "learner"
                                ? session.mentor_name || "—"
                                : session.learner_name || "—"}
                            </span>

                            <span>
                              📅 {formatDate(session.created_at)}
                            </span>

                          </div>

                        </div>

                        <div className="flex gap-2">

                          {tab === "mentor" && status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(session.id, "accepted")}
                                disabled={actionLoading[session.id]}
                                className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() => updateStatus(session.id, "rejected")}
                                disabled={actionLoading[session.id]}
                                className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-lg"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {status === "accepted" && (
                            <button
                              onClick={() => updateStatus(session.id, "completed")}
                              disabled={actionLoading[session.id]}
                              className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-lg"
                            >
                              ✓ Complete
                            </button>
                          )}

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}