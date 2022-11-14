import React, { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthProvider";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  // useEffect(() => {
  //   console.log("use:", auth);
  // }, [auth]);

  console.log(auth.roles);
  console.log(auth);
  //debugger;
  return auth?.roles?.find((role) => {
    // THIS CHECK ONLY ONE ROLE, CHANGE WHEN NEEDED
    return role == allowedRoles[0];
  }) ? (
    <Outlet />
  ) : auth?.login ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;