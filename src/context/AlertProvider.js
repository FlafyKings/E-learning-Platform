import React from "react";
import { createContext, useState } from "react";

const AlertContext = createContext({
  alert: false,
  setAlert: () => {},
  alertMessage: "",
  setAlertMessage: () => {},
  alertType: "success",
  setAlertType: () => {},
});

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  return (
    <AlertContext.Provider
      value={{
        alert,
        setAlert,
        alertMessage,
        setAlertMessage,
        alertType,
        setAlertType,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
