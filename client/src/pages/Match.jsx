import { useState } from "react";
import api from "../api";

export default function Match() {
  const [query, setQuery] = useState("");
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(false);

  const matchMentor = async () => {
    try {
      setLoading(true);

      const res = await api.post("/mentors/ai-match", {
        query,
      });

      setMentor(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-semibold mb-6 text-slate-700">
        AI Mentor Recommendation
      </h2>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

        <input
          type="text"
          placeholder="Example: I need help with recursion"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-xl p-3 w-full mb-4"
        />

        <button
          onClick={matchMentor}
          className="bg-slate-600 text-white px-6 py-2 rounded-xl"
        >
          {loading ? "Finding Mentor..." : "Find Mentor with AI"}
        </button>

      </div>

      {mentor && (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md">

          <h3 className="text-xl font-semibold text-green-600 mb-2">
            ⭐ Best Mentor for You
          </h3>

          <p>
            <strong>Subject:</strong> {mentor.subject}
          </p>

          <p>
            <strong>Proficiency:</strong> {mentor.proficiency}
          </p>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Book Session
          </button>

        </div>
      )}

    </div>
  );
}