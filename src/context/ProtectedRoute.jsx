import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // logged in, render the child component
  return children;
};

export default ProtectedRoute;
