import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/login.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        alert("Login successful!");
        navigate("/home");
      } else {
        setError(response.data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="loginPage">
      <div className="left-side">
        <div className="welcome">Welcome to Online Quiz Portal</div>
        <div className="started">Let's get started!</div>
      </div>

      <div className="right-side">
        

        <form className="inputs-container" onSubmit={handleLogin}>
          <div className="login-title">Log In</div>
          <div className="email-container">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="forgot-password-container">
            <span
              className="forgot-password"
              onClick={() => navigate("/reset-password")}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              Forgot Password?
            </span>
          </div>

          <div className="submit-button-container">
            <button type="submit" id="login">Log In</button>
          </div>
          <div className="sign-up-container">
          Don't have an account?{" "}
          <span
            className="sign-up"
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Sign Up
          </span>
        </div>
        </form>

        
      </div>
    </div>
  );
};

export default LoginPage;
