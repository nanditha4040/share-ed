import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registered successfully!");
      navigate("/login");

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[400px]">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded-xl p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full border rounded-xl p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Student">Student</option>
            <option value="Mentor">Mentor</option>
          </select>

          <button
            type="submit"
            className="w-full bg-slate-600 text-white py-3 rounded-xl hover:bg-slate-700"
          >
            Register
          </button>

        </form>
      </div>
    </div>
  );
}