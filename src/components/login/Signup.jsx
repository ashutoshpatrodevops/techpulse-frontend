import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useFlash } from "../../context/FlashContext";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
    const { showFlash } = useFlash();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/users/signup",
        { username, email, password },
        { withCredentials: true }
      );
      // Update AuthContext
      setAuth(true);
      setUser(res.data.user);
      showFlash(`Welcome back, ${res.data.user.username}!`, "success");
      navigate("/"); // redirect to homepage
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
       showFlash(err.response?.data?.error || "signup failed. Try again!", "error");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row mt-lg-5 mt-3 justify-content-center align-items-center">
        {/* Left Side Image */}
        <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-2 text-center p-lg-3 p-md-2 p-3 order-first order-lg-first">
          <img src="/account.svg" alt="Account" className="img-fluid" style={{ width: "70%", maxWidth: "400px" }} />
        </div>

        {/* Right Side Signup Form */}
        <div className="col-lg-5 col-md-6 col-12 d-flex align-items-center p-lg-3 p-md-4 p-3">
          <div className="w-100">
            <h2 className="mb-4 text-center text-lg-start">Create an Account</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formFullName">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                Sign Up
              </Button>
            </Form>

            {/* Login Link */}
            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;