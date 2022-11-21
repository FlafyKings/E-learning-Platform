import React from "react";
import { createContext, useState } from "react";

const AuthContext = createContext({
  auth: {},
  setAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  const [newUser, setNewUser] = useState(false);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, persist, setPersist, newUser, setNewUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
