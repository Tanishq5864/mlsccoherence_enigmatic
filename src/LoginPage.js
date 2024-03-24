import React from 'react';
import './style.css'; // Import your CSS file
import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Post");
    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });
      console.log(email,password)
      const data = response.data;
      if (response.status === 400 || !data) {
        window.alert("Login Failed ");
        console.log("Login Failed ");
      } else {
        console.log("Login Successfully");
        window.alert("Login Successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("An error occurred during Login.");
    }
  }

  return (
    <section className="wrapper">
    
      <div className="form login">
        <header>Login</header>
        <form action="#">
          <input type="text" placeholder="Email address" required />
          <input type="password" placeholder="Password" required />
          <a href="#">Forgot password?</a>
          <input type="submit" id="redirectButton1" value="Login" onClick={handleLogin} />
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
