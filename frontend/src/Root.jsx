
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./App";
import Login from "./Login";
import Complaints from "./Complaints";
import Dashboard from "./Dashboard";
import MyComplaints from "./MyComplaints";
import Feedback from "./Feedback";
import Profile from "./Profile";
export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
       
        <Route path="*" element={<Home />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
