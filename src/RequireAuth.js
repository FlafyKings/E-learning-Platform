import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthProvider";
import useAuth from "./hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  // console.log(auth);
  //debugger;
  return auth?.roles?.find(
    (role) => allowedRoles?.includes(role) // THIS CHECKS ONLY ONE ROLE, CHANGE WHEN NEEDED
  ) ? (
    <Outlet />
  ) : auth?.login ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
