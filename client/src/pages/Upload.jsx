import { useState } from "react";
import api from "../api";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      console.log("Uploading...");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("file", file);

      const res = await api.post("/notes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", res.data);

      setMessage("Upload successful!");

      setTitle("");
      setSubject("");
      setFile(null);

    } catch (err) {
      console.error("Upload error:", err);
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

 
    return (
  <div className="flex justify-center items-start pt-16">
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-indigo-200 w-[420px]">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
📤 Upload Notes
</h2>

      <form onSubmit={handleUpload} className="space-y-4">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-xl p-3"
          required
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm border border-indigo-200 rounded-xl p-3 bg-white"
          required
        />

        <button className="mt-4 px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition">
Upload Notes
</button>

        {message && (
          <p className="text-sm mt-3 text-slate-700">{message}</p>
        )}

      </form>
        </div>
  </div>
);
 
}