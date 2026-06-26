import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);
  }, []);

  return (
    <div className="p-8 grid grid-cols-2 gap-6">

     
      {/* Student Features */}
      {role === "student" && (
        <div className="bg-[#FFFDF6] p-6 rounded-3xl border border-[#5F4BB6]/40 shadow-sm hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Find a Mentor</h2>
          <p className="text-sm text-gray-500 mt-2">
            Connect with mentors who can help you
          </p>

          <button
            onClick={() => navigate("/mentors")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Find Mentor
          </button>
        </div>
      )}

      

      {/* Mentor Dashboard */}
      {role === "mentor" && (
        <div className="bg-[#FFFDF6] p-6 rounded-3xl border border-[#5F4BB6]/40 shadow-sm hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Mentor Sessions</h2>
          <p className="text-sm text-gray-500 mt-2">
            Manage your mentoring sessions
          </p>

          <button
            onClick={() => navigate("/sessions")}
            className="mt-4 bg-[#5F4BB6] text-white px-4 py-2 rounded-xl hover:bg-[#4b3aa3] shadow-md hover:shadow-lg hover:scale-105 transition"
          >
            View Sessions
          </button>
        </div>
      )}

      {/* AI Assistant */}
      <div className="bg-[#FFFDF6] p-6 rounded-3xl border border-[#5F4BB6]/40 shadow-sm hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2">

  <span className="animate-bounce">🤖</span>

  Ask Robo Tutor

</h2>

        <input
          type="text"
          placeholder="Ask a question..."
          className="w-full border rounded-xl p-3 mt-3"
        />

        <button className="mt-3 bg-[#5F4BB6] text-white px-4 py-2 rounded-xl hover:bg-[#4b3aa3] shadow-md hover:shadow-lg hover:scale-105 transition">
          Get Answer
        </button>
      </div>

      {/* Recent Notes */}
      <div className="bg-[#FFFDF6] p-6 rounded-3xl border border-[#5F4BB6]/40 shadow-sm hover:shadow-lg transition">
        <p className="text-sm text-gray-500 mt-2">
          View latest approved notes uploaded by students
        </p>

        <button
          onClick={() => navigate("/notes")}
          className="mt-4 bg-[#5F4BB6] text-white px-4 py-2 rounded-xl hover:bg-[#4b3aa3] shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          Browse Notes
        </button>
      </div>

    </div>
  );
}