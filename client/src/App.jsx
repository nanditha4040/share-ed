import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Credits from "./pages/Credits";
import Sessions from "./pages/Sessions";
import Mentors from "./pages/Mentors";
import Admin from "./pages/Admin";
import Upload from "./pages/Upload";
import AIAssistant from "./pages/AIAssistant";
import Match from "./pages/Match";
import Notes from "./pages/Notes";
import BecomeMentor from "./pages/BecomeMentor";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notes" element={<Notes />} />
        <Route path="upload" element={<Upload />} />
        <Route path="mentors" element={<Mentors />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="credits" element={<Credits />} />
        <Route path="match" element={<Match />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="admin" element={<Admin />} />
        <Route path="/become-mentor" element={<BecomeMentor />} />
      </Route>

    </Routes>
  );
}

export default App;