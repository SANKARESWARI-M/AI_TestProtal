import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/signup.css";

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [userid, setUserid] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        userid,
        email,
        password,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/");
      } else {
        alert(response.data.message || "Signup failed.");
      }
    } catch (err) {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="signUpPage">
      <div className="left-side">
        <div className="welcome">Welcome to Test Portal</div>
        <div className="started">Let's get started!</div>
      </div>

      <div className="right-side">
       

        <form className="inputs-container" onSubmit={handleSignUp}>
           <div className="sign-up-title">Sign Up</div>
          <div className="email-container">
            <input
              type="text"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="email-container">
            <input
              type="text"
              placeholder="User ID"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              required
            />
          </div>
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
          <div className="confirm-password-container">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="submit-button-container">
            <button type="submit">Sign Up</button>
          </div>
          <div className="log-in-container">
          Already have an account? <Link to="/" className="log-in">Login</Link>
        </div>
        </form>

        
      </div>
    </div>
  );
};

export default SignUpPage;
