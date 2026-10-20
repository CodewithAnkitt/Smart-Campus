
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./App";
import Auth from "./Auth";

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
