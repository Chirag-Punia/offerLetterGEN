import React, { useState } from "react";
import "../styles/Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Forgot = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false); 
  const base_url = "https://offerlettergen.onrender.com";
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(`${base_url}/auth/reset`, {
        email: email,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.msg === "OTP sent successfully") {
          toast.success("OTP sent successfully");
          setOtpSent(true);
        } else {
          toast.error("Error sending OTP");
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Error sending OTP");
      });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(`${base_url}/auth/verify-otp`, {
        email: email,
        otp: otp,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.msg === "OTP verified successfully") {
          toast.success("OTP verified successfully");
          setOtpVerified(true);
        } else {
          toast.error("Invalid OTP");
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Error verifying OTP");
      });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    await axios
      .post(`${base_url}/auth/update-password`, {
        email: email,
        newPassword: newPassword,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.msg === "Password updated successfully") {
          toast.success("Password updated successfully");
          navigate("/"); // Redirect to home page
        } else {
          toast.error("Error updating password");
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Error updating password");
      });
  };

  return (
    <section className="container">
      <div className="login-container">
        <div className="circle circle-one"></div>
        <div className="form-container">
          <img
            src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
            alt="illustration"
            className="illustration"
          />
          <h1 className="opacity">RESET PASSWORD</h1>
          {loading && <div className="loading-spinner"></div>} {}
          {!otpSent && !loading && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="animated-button" type="submit">
                SEND OTP
              </button>
            </form>
          )}
          {otpSent && !otpVerified && !loading && (
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="animated-button" type="submit">
                VERIFY OTP
              </button>
            </form>
          )}
          {otpVerified && !loading && (
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="NEW PASSWORD"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="CONFIRM PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="animated-button" type="submit">
                RESET PASSWORD
              </button>
            </form>
          )}
        </div>
        <div className="circle circle-two"></div>
      </div>
      <div className="theme-btn-container"></div>
    </section>
  );
};
