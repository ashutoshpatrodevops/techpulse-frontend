import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useFlash } from "../../context/FlashContext";  // ⬅️ import flash hook

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth, setUser } = useContext(AuthContext);
  const { showFlash } = useFlash();   // ⬅️ use flash
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        { username, password },
        { withCredentials: true }
      );

      // Update AuthContext
      setAuth(true);
      setUser(res.data.user);

      // ✅ Show success flash
      showFlash(`Welcome back, ${res.data.user.username}!`, "success");

      navigate("/"); // redirect to homepage
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);

      // ❌ Instead of setError, use flash
      showFlash(err.response?.data?.error || "Login failed. Try again!", "error");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row mt-lg-5 mt-3 justify-content-center align-items-center">
        <div className="col-lg-5 col-md-6 col-12 p-lg-5 p-md-4 p-3 m-lg-5 m-md-3 m-2 d-flex align-items-center">
          <div className="w-100">
            <h2 className="mb-4 text-center text-lg-start">Welcome to TechPulse</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                style={{
                  background: "blueviolet",
                  border: "none",
                  borderRadius: "50px",
                  padding: "10px",
                }}
              >
                Log In
              </Button>
            </Form>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Sign Up
              </Link>
            </p>

            <div className="d-flex justify-content-center mt-3 gap-3">
              <a
                href={`${import.meta.env.VITE_API_URL}/users/auth/google`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blueviolet", fontSize: "1.5rem" }}
              >
                <FaGoogle />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blueviolet", fontSize: "1.5rem" }}
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blueviolet", fontSize: "1.5rem" }}
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12 mt-lg-5 mt-md-3 mt-2 text-center p-lg-5 p-md-4 p-3 order-first order-md-last">
          <img src="/login.svg" alt="Account" className="img-fluid" style={{ width: "80%", maxWidth: "400px" }} />
        </div>
      </div>
    </div>
  );
};

export default Login;