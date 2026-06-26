import { useEffect, useState } from "react";
import api from "../api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [myNotes, setMyNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");

  const fetchNotes = async () => {
    try {
      const approved = await api.get("/notes");
      const mine = await api.get("/notes/my");

      setNotes(approved.data);
      setMyNotes(mine.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  /* SEARCH + FILTER */
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      subject === "" ||
      note.subject.toLowerCase() === subject.toLowerCase();

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-8 space-y-10">

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Search notes by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl p-3 w-full"
        />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border rounded-xl p-3 w-48"
        >
          <option value="">All Subjects</option>
          <option value="DSA">DSA</option>
          <option value="DBMS">DBMS</option>
          <option value="OS">OS</option>
          <option value="CN">CN</option>
        </select>

      </div>

      {/* AVAILABLE NOTES */}
      <div>
        <h1 className="text-2xl font-semibold mb-4">
          📚 Available Notes
        </h1>

        {filteredNotes.length === 0 && (
          <p className="text-gray-500">No notes found.</p>
        )}

        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="border rounded-xl p-4 mb-3"
          >
            <h3 className="font-medium">{note.title}</h3>

            <p className="text-sm text-gray-500">
              {note.subject}
            </p>

            <a
              href={note.file_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View File
            </a>
          </div>
        ))}
      </div>

      {/* MY UPLOADS */}
      <div>
        <h1 className="text-2xl font-semibold mb-4">
          📤 My Uploads
        </h1>

        {myNotes.length === 0 && (
          <p className="text-gray-500">
            You haven't uploaded any notes yet.
          </p>
        )}

        {myNotes.map((note) => (
          <div
            key={note.id}
            className="border rounded-xl p-4 mb-3"
          >
            <h3 className="font-medium">{note.title}</h3>

            <p className="text-sm text-gray-500">
              {note.subject}
            </p>

            <p className="text-sm mt-1">
              {note.verified_status
                ? "✅ Approved"
                : "⏳ Pending Approval"}
            </p>

            <a
              href={note.file_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View File
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}