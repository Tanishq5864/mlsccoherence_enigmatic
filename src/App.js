import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import YoutubeDashboard from "./YoutubeDashboard";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import ApiForm from "./apiForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/dashboard" element={<YoutubeDashboard />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/form" element={<ApiForm />} />



      </Routes>
    </Router>
  );
}

export default App;
