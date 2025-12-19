// src/components/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/ResetPassword.css";


const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      if (res.data.success) {
        setStep(2);
        setMessage("✅ OTP sent to your email.");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("❌ Failed to send OTP.");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (res.data.success) {
        setMessage("🎉 Password reset successful!");
        setSuccess(true);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("❌ Failed to reset password.");
    }
  };

  return (
    <div className="reset-container" style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Reset Password</h2>
      <p style={{ color: success ? "green" : "red" }}>{message}</p>

      {!success && (
        <>
          {step === 1 ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              /><br /><br />
              <button onClick={sendOtp}>Send OTP</button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              /><br /><br />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              /><br /><br />
              <button onClick={resetPassword}>Reset Password</button>
            </>
          )}
        </>
      )}

      {success && (
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back to Login
        </button>
      )}
    </div>
  );
};

export default ResetPassword;