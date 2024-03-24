import React from "react";
import "./style.css"; 
// Import your CSS file

import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  // const [alogged, setAlogged] = useState("false");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Post");
    try {
      const response = await axios.post("http://localhost:4000/register", {
        email,
        password,
      });
      const data = response.data;
      if (response.status === 400 || !data) {
        window.alert("Login Failed ");
        console.log("Login Failed ");
      } else {
        console.log("Login Successfully");
        window.alert("Login Successfully");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("An error occurred during Login.");
    }
    navigate("/login");
  };

  return (
    <section className="wrapper">
      <div className="form signup">
        <header>Signup</header>
        <form action="#" id="signupForm">
          <input id="username" type="text" placeholder="Full name" required />
          <input id="email" type="text" placeholder="Email address" required />
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
          />
          <div className="checkbox">
            <input type="checkbox" id="signupCheck" />
            <label htmlFor="signupCheck">I accept all terms & conditions</label>
          </div>
          <input type="submit" value="Signup" id="redirectButton" onClick={handleLogin} />
        </form>
      </div>

      
    </section>
  );
}

export default RegisterPage;
