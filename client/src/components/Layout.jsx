import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import RobotMascot from "./RobotMascot";

export default function Layout() {

  const [role, setRole] = useState("");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await api.get("/users/me");
      setCredits(res.data.user?.credits || res.data.credits || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const navStyle = ({ isActive }) =>
  `p-3 rounded-lg transition-all ${
    isActive
      ? "bg-[#EDE9FE] text-[#5F4BB6] font-semibold"
      : "text-slate-600 hover:bg-[#F3F0FF] hover:text-[#5F4BB6]"
  }`;

  return (
    <div className="min-h-screen bg-[#F3F0FF] flex">

      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md p-6 flex flex-col gap-4">

       <h2 className="text-2xl font-bold text-indigo-600 mb-6 tracking-tight">
  ShareEd
</h2>

        <NavLink
  to="/dashboard"
  className={({ isActive }) =>
    navStyle({ isActive }) + " hover:translate-x-1"
  }
>
  Dashboard
</NavLink>

        {role === "student" && (
          <NavLink to="/upload" className={navStyle}>
            Upload Notes
          </NavLink>
        )}

        {role === "student" && (
          <NavLink to="/mentors" className={navStyle}>
            Mentors
          </NavLink>
        )}

        <NavLink to="/sessions" className={navStyle}>
          Sessions
        </NavLink>

        <NavLink to="/credits" className={navStyle}>
          Credits
        </NavLink>

        <NavLink to="/match" className={navStyle}>
          AI Match
        </NavLink>

        <NavLink to="/ai" className={navStyle}>
          AI Assistant
        </NavLink>

        {role === "admin" && (
          <NavLink to="/admin" className={navStyle}>
            Admin
          </NavLink>
        )}

      </aside>

      {/* Main */}
      <div className="flex-1 p-8 relative z-50">
        <div className="absolute pointer-events-none top-20 left-1/3 w-96 h-96 bg-[#EDE9FE] blur-3xl opacity-50 rounded-full"></div>
        <div className="absolute pointer-events-none top-10 left-20 w-60 h-60 bg-[#EDE9FE] rounded-full blur-3xl opacity-40 z-0"></div>

<div className="absolute pointer-events-none bottom-20 right-20 w-72 h-72 bg-[#FFFACD] rounded-full blur-3xl opacity-40 z-0"></div>
      <div className="absolute pointer-events-none top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 opacity-20 blur-3xl rounded-full -z-10"></div>
        {/* Header */}
       

          <div className="flex items-center justify-between px-2 mb-8">
  
  <div className="flex items-center gap-2 text-lg font-semibold text-slate-700">

  Welcome back

  <span className="robot-wave">
    🤖
  </span>

</div>



          <div className="flex items-center gap-4">

            {/* Dynamic Credits */}
            <div className="bg-indigo-500/10 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium">
  {credits} Credits
</div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>

        </div>

        <Outlet />
        <RobotMascot />

      </div>
    </div>
  );
}