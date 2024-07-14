import React, { useState } from "react";
import "../styles/Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showNextPage, setShowNextPage] = useState(false); 
  const base_url = "https://offerlettergen.onrender.com";
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${base_url}/auth/login`, {
        email: email,
        password: password,
      });
      setLoading(false);
      if (res.data.msg === "Wrong password") {
        toast.error("Wrong password");
      } else if (res.data.msg === "Login successfully") {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          toast.success("Login successfully");

          setTimeout(() => {
            setShowNextPage(true);
          }, 1000);
        }
      } else {
        toast.error("ERROR CONTACT ADMIN");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Login failed");
    }
  };


  if (showNextPage) {
    navigate("/dashboard"); 
  }

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
          <h1 className="opacity">LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="animated-button" type="submit">
              SUBMIT
            </button>
          </form>
          <div className="register-forget opacity">
            <Link to="/forgot">FORGOT PASSWORD</Link>
          </div>
        </div>
        {loading && <div className="loading-spinner"></div>} {}
        <div className="circle circle-two"></div>
      </div>
      <div className="theme-btn-container"></div>
    </section>
  );
};

export default Login;
