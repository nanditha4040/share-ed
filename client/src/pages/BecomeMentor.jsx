import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function BecomeMentor() {

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const [subject, setSubject] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [availability, setAvailability] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !proficiency || !availability) {
      alert("Please fill all fields");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await api.post(
        "/mentors",
        {
          subject,
          proficiency,
          availability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Session created successfully! 🎉");

      // reset form
      setSubject("");
      setProficiency("");
      setAvailability("");

      setShowForm(false);

      navigate("/sessions");

    } catch (err) {
      console.log(err);
      alert("Error creating session");
    }
  };

  return (
    <div className="p-10 flex flex-col items-center">

      <h2 className="text-2xl font-semibold mb-6">
        Mentor Dashboard
      </h2>

      {/* CREATE SESSION BUTTON */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Session
        </button>
      )}

      {/* SESSION FORM */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow w-[420px]">

          <h3 className="text-lg font-semibold mb-4 text-center">
            Create Session
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="Proficiency"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="Availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <div className="flex gap-3">

              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Create Session
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}