import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthProvider";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  // console.log(auth);
  //debugger;
  return auth?.roles?.find((role) => {
    // THIS CHECKS ONLY ONE ROLE, CHANGE WHEN NEEDED
    return role === allowedRoles[0];
  }) ? (
    <Outlet />
  ) : auth?.login ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
