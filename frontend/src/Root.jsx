
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./App";
import Auth from "./Auth";
import Complaints from "./Complaints";
import Dashboard from "./Dashboard";
import MyComplaints from "./MyComplaints";
import Feedback from "./Feedback";
export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="*" element={<Home />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  );
}
