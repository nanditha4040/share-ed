import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user.id);
      localStorage.setItem("role", res.data.user.role); // ⭐ important

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-2">

        <div className="bg-slate-600 text-white flex items-center justify-center p-10">
          <h1 className="text-3xl font-light tracking-wide">
            Learn. Earn. Grow.
          </h1>
        </div>

        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-slate-700">
            Log in to Share-Ed
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

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

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-slate-600 text-white py-3 rounded-xl hover:bg-slate-700"
            >
              Log In
            </button>

          </form>

          <p className="text-sm mt-6 text-slate-600">
            New to Share-Ed?{" "}
            <Link
              to="/register"
              className="text-slate-700 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}