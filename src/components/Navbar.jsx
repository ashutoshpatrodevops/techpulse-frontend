import React, { useEffect, useState, useContext } from "react";
import { Navbar, Nav, Container, Image, Dropdown } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomNavbar = () => {
  const { auth, setAuth, user, setUser } = useContext(AuthContext);

  // Check session when navbar loads
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/check-auth`, { withCredentials: true })
      .then((res) => {
        if (res.data.isAuth) {
          setAuth(true);
          setUser(res.data.user);
        } else {
          setAuth(false);
          setUser(null);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, { withCredentials: true });
      setAuth(false);
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Custom dropdown toggle component for desktop
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className="profile-container d-flex align-items-center"
      style={{
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "25px",
        transition: "all 0.3s ease",
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Image
        src="/profile.svg"
        alt="Profile"
        roundedCircle
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          border: "2px solid rgba(138, 43, 226, 0.5)",
        }}
      />
      <span 
        className="ms-2 fw-semibold d-none d-md-inline"
        style={{ 
          color: "blueviolet",
          fontSize: "0.95rem"
        }}
      >
        {user?.username || "User"}
      </span>
      <i 
        className="fas fa-chevron-down ms-2 d-none d-md-inline"
        style={{ 
          color: "blueviolet", 
          fontSize: "0.8rem",
          transition: "transform 0.3s ease"
        }}
      ></i>
    </div>
  ));

  // Mobile profile dropdown toggle (just the profile image)
  const MobileProfileToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: "4px",
        borderRadius: "50%",
        transition: "all 0.3s ease",
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Image
        src="/profile.svg"
        alt="Profile"
        roundedCircle
        style={{
          width: "36px",
          height: "36px",
          objectFit: "cover",
          border: "2px solid rgba(138, 43, 226, 0.5)",
        }}
      />
    </div>
  ));

  return (
    <>
      <Navbar
        expand="lg"
        className="custom-navbar sticky-top mx-auto mt-4 px-3 px-md-4 py-2"
        style={{
          width: "90%",
          borderRadius: "1rem",
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <Container fluid>
          {/* Brand */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Image
              src="/logo2.svg"
              alt="TechPulse Logo"
              style={{ 
                width: "40px", 
                height: "40px", 
                objectFit: "cover" 
              }}
              className="me-2 d-block d-sm-block"
            />
            <span 
              className="fw-bold d-none d-sm-block"
              style={{ 
                color: "blueviolet",
                fontSize: "clamp(1.2rem, 4vw, 1.8rem)"
              }}
            >
              TechPulse
            </span>
            <span 
              className="fw-bold d-block d-sm-none"
              style={{ 
                color: "blueviolet",
                fontSize: "1.2rem"
              }}
            >
              TechPulse
            </span>
          </Navbar.Brand>

          {/* Mobile Auth Section (visible only on small screens) */}
          <div className="d-lg-none">
            {!auth ? (
              // Mobile Login Icon
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "blueviolet",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(138, 43, 226, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  className="login-icon-mobile"
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 4px 15px rgba(138, 43, 226, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 2px 10px rgba(138, 43, 226, 0.3)";
                  }}
                >
                  <i 
                    className="fas fa-user" 
                    style={{ 
                      color: "white", 
                      fontSize: "1.1rem" 
                    }}
                  ></i>
                </div>
              </Link>
            ) : (
              // Mobile Profile Dropdown
              <Dropdown align="end" className="profile-dropdown-mobile">
                <Dropdown.Toggle as={MobileProfileToggle} />
                
                <Dropdown.Menu
                  className="profile-menu"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    minWidth: "200px",
                    padding: "8px 0",
                    marginTop: "8px",
                    right: "0 !important",
                    left: "auto !important",
                  }}
                >
                  {/* User Info Header */}
                  <div 
                    className="px-3 py-2 border-bottom"
                    style={{ borderColor: "rgba(138, 43, 226, 0.2)" }}
                  >
                    <div className="d-flex align-items-center">
                      <Image
                        src="/profile.svg"
                        alt="Profile"
                        roundedCircle
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "cover",
                          border: "2px solid rgba(138, 43, 226, 0.3)",
                        }}
                      />
                      <div className="ms-2">
                        <div 
                          style={{ 
                            color: "blueviolet", 
                            fontWeight: "600",
                            fontSize: "0.9rem"
                          }}
                        >
                          {user?.username || "User"}
                        </div>
                        <div 
                          style={{ 
                            color: "#666", 
                            fontSize: "0.75rem"
                          }}
                        >
                          {user?.email || "user@example.com"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <Dropdown.Item
                    as={Link}
                    to={`/users/${user?._id}/dashboard`}
                    className="d-flex align-items-center py-2"
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="fas fa-tachometer-alt me-3" style={{ color: "blueviolet", width: "16px" }}></i>
                    Dashboard
                  </Dropdown.Item>

                  <Dropdown.Divider style={{ borderColor: "rgba(138, 43, 226, 0.2)" }} />

                  {/* Logout Button */}
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="d-flex align-items-center py-2"
                    style={{
                      color: "#dc3545",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-3" style={{ color: "#dc3545", width: "16px" }}></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="d-none d-lg-block">
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="d-flex align-items-center">
                {!auth ? (
                  // Desktop Get Started Button
                  <Button
                    style={{
                      background: "blueviolet",
                      color: "white",
                      height: "40px",
                      fontSize: "0.95rem",
                      borderRadius: "50px",
                      padding: "0 20px",
                      textTransform: "none",
                      fontWeight: "500",
                      boxShadow: "0 2px 10px rgba(138, 43, 226, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    className="get-started-btn"
                  >
                    <Link
                      to="/signup"
                      style={{
                        textDecoration: "none",
                        color: "white",
                      }}
                    >
                      Get started
                    </Link>
                  </Button>
                ) : (
                  // Desktop Profile Dropdown
                  <Dropdown align="end" className="profile-dropdown">
                    <Dropdown.Toggle as={CustomToggle} />
                    
                    <Dropdown.Menu
                      className="profile-menu"
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        minWidth: "200px",
                        padding: "8px 0",
                        marginTop: "8px",
                      }}
                    >
                      {/* User Info Header */}
                      <div 
                        className="px-3 py-2 border-bottom"
                        style={{ borderColor: "rgba(138, 43, 226, 0.2)" }}
                      >
                        <div className="d-flex align-items-center">
                          <Image
                            src="/profile.svg"
                            alt="Profile"
                            roundedCircle
                            style={{
                              width: "32px",
                              height: "32px",
                              objectFit: "cover",
                              border: "2px solid rgba(138, 43, 226, 0.3)",
                            }}
                          />
                          <div className="ms-2">
                            <div 
                              style={{ 
                                color: "blueviolet", 
                                fontWeight: "600",
                                fontSize: "0.9rem"
                              }}
                            >
                              {user?.username || "User"}
                            </div>
                            <div 
                              style={{ 
                                color: "#666", 
                                fontSize: "0.75rem"
                              }}
                            >
                              {user?.email || "user@example.com"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dashboard Link */}
                      <Dropdown.Item
                        as={Link}
                        to={`/users/${user?._id}/dashboard`}
                        className="d-flex align-items-center py-2"
                        style={{
                          color: "#333",
                          textDecoration: "none",
                          fontSize: "0.9rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <i className="fas fa-tachometer-alt me-3" style={{ color: "blueviolet", width: "16px" }}></i>
                        Dashboard
                      </Dropdown.Item>

                      <Dropdown.Divider style={{ borderColor: "rgba(138, 43, 226, 0.2)" }} />

                      {/* Logout Button */}
                      <Dropdown.Item
                        onClick={handleLogout}
                        className="d-flex align-items-center py-2"
                        style={{
                          color: "#dc3545",
                          fontSize: "0.9rem",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-3" style={{ color: "#dc3545", width: "16px" }}></i>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
      
      {/* Add Font Awesome for icons if not already included */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </>
  );
};

export default CustomNavbar;