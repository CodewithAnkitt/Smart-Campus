
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./App";
import Login from "./Login";
import Complaints from "./Complaints";
import Dashboard from "./Dashboard";
import MyComplaints from "./MyComplaints";
import Feedback from "./Feedback";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin dashboard */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* Existing student and faculty pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
