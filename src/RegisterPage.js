import * as React from "react";
import { useState } from "react";
import { TextField } from "@mui/material";
import "./Stylesheets/LoginPage.css";
import {
  Paper,
  Button,
  Box,
  FormControlLabel,
  Link,
  Alert,
} from "@mui/material";
import axios from "./AxiosInterceptor.js";
import useAuth from "./hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

function RegisterPage() {
  //Variables describing users credentials
  const [login, setLogin] = useState("");
  const [password, setPassowrd] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  //Variables describing alerts
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(login);
    console.log(password);
    console.log(passwordConfirm);

    await axios
      .post("/register", {
        login: login,
        password: password,
        passwordConfirm: passwordConfirm,
      })
      .then((response) => {
        localStorage.setItem("jwtToken", response.data.accessToken); //not safe at all but we dont have https so w/e

        let roles = [response.data.roles];
        let accessToken = response.data.accessToken;
        setAuth({ login, password, roles, accessToken });
        navigate("/dashboard", true);
      })
      .catch((error) => {
        //Error handling
        if (error.response) {
          //The client was given an error response

          if (!error.response.data.type) {
            if (error.response.status >= 400) {
              setAlertType("error");
            } else if (error.response.status >= 200) {
              setAlertType("success");
            }
          } else {
            setAlertType(error.response.data.type);
          }

          setAlert(true);
          setAlertMessage(error.response.data.message);

          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          console.log(alertMessage);
        } else if (error.request) {
          //The client never received a response
          console.log(error.request);
        } else {
          //Other errors
          console.log("Error", error.message);
        }
      });
  };

  return (
    <Paper
      onSubmit={handleSubmit}
      className="LoginPaper"
      sx={{ width: 400 }}
      elevation={3}
    >
      <Box
        component="form"
        sx={{ mt: 5 }}
        gap={5}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <h1 className="LogoHeader">LepszyUPEL</h1>
        <TextField
          helperText={alertType === "Login" ? alertMessage : ""}
          error={alertType === "Login" ? alertMessage : ""}
          onChange={(event) => setLogin(event.target.value)}
          value={login}
          required
          autofocus
          label="Login"
          name="login"
          id="login"
          sx={{ mr: 5, ml: 5 }}
          variant="standard"
          size="small"
        />

        <Box
          sx={{ mr: 5, ml: 5, mb: 7 }}
          display="flex"
          justifyContent="space-between"
          gap={3}
        >
          <TextField
            helperText={alertType === "Password" ? alertMessage : ""}
            error={alertType === "Password" ? alertMessage : ""}
            onChange={(event) => setPassowrd(event.target.value)}
            value={password}
            required
            label="Hasło"
            name="password"
            id="password"
            type="password"
            variant="standard"
            size="small"
          />
          <TextField
            helperText={alertType === "PasswordConfirm" ? alertMessage : ""}
            error={alertType === "PasswordConfirm" ? alertMessage : ""}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            value={passwordConfirm}
            required
            label="Potwierdź"
            name="passwordConfirm"
            id="passwordConfirm"
            type="password"
            variant="standard"
            size="small"
          />
        </Box>

        <Box
          sx={{ mr: 5, ml: 5, mb: 7 }}
          display="flex"
          justifyContent="space-between"
          gap={5}
        >
          <Link
            component={Button}
            variant="text"
            underline="none"
            href="/login"
          >
            Zaloguj się
          </Link>
          <Button variant="contained" type="submit">
            Rejestruj
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default RegisterPage;
