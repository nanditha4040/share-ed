import { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes/all");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/notes/approve/${id}`);
      fetchNotes(); // refresh list after approval
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const pendingNotes = notes.filter((note) => !note.verified_status);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Admin Panel - Pending Notes
      </h1>

      {pendingNotes.length === 0 && <p>No pending notes.</p>}

      {pendingNotes.map((note) => (
        <div key={note.id} className="border rounded-xl p-4 mb-4">
          <h3 className="font-medium">{note.title}</h3>
          <p className="text-sm mb-2">{note.subject}</p>

          <a
            href={note.file_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-sm"
          >
            View File
          </a>

          <br />

          <button
            onClick={() => handleApprove(note.id)}
            className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}