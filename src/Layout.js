import { Outlet } from "react-router-dom";
import React from "react";
import useAuth from "./hooks/useAuth";
import HeaderBar from "./HeaderBar";
import useAlert from "./hooks/useAlert";
import { IconButton, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";

const Layout = () => {
  const { auth } = useAuth();
  const { alert, setAlert, alertMessage, alertType } = useAlert();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  return (
    <main className="App">
      {Object.keys(auth).length === 0 ? <></> : <HeaderBar></HeaderBar>}
      {/*auth?.newUser ? <PopUpForm></PopUpForm> : <></>*/}
      <Snackbar open={alert} onClose={handleClose} autoHideDuration={5000}>
        <Alert
          elevation={6}
          sx={{
            width: "100%",
            mt: 1,
          }}
          icon={<CheckIcon fontSize="inherit" />}
          severity={alertType}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Outlet />
    </main>
  );
};

export default Layout;
