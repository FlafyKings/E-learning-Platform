import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuth, children }) => {
  if (localStorage.getItem("jwtToken") == "") {
    return isAuth ? children : <Navigate to="/login"></Navigate>;
  }

  return isAuth ? <Navigate to="/dashboard"></Navigate> : children;
};

export default ProtectedRoute;
