// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Import Register
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar"; // Optional: Navigation bar

function App() {
  return (
    <Router>
      <Navbar /> {/* Include Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />{" "}
        {/* Add Register Route */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
