import * as React from "react";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import "./Stylesheets/LoginPage.css";
import {
  Paper,
  Button,
  Box,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "./api/axios";
import useAuth from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PopUpForm from "./PopUpForm";

function RegisterPage() {
  //Variables describing users credentials
  const [login, setLogin] = useState("");
  const [password, setPassowrd] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  //Variables describing alerts
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [newUser, setNewUser] = useState(false);

  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  //const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(login);
    console.log(password);
    console.log(passwordConfirm);

    await axios
      .post("/register", JSON.stringify({ login, password, passwordConfirm }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        let roles = response.data.roles;
        let accessToken = response.data.accessToken;
        localStorage.setItem("login", login);
        if (response.data.newUser) {
          setNewUser(response.data.newUser);
        }
        console.log("new user iosjfdhoijdsgh", newUser, response.data.newUser);
        setAuth({ login, password, roles, accessToken, newUser });

        //navigate("/dashboard", true);
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

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

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
          autoFocus
          autoComplete="off"
          label="Login"
          name="login"
          id="login"
          sx={{ mr: 5, ml: 5 }}
          variant="standard"
          size="small"
        />

        <Box
          sx={{ mr: 5, ml: 5, mb: 1 }}
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
          sx={{ mr: 5, ml: 5, mb: -0.2, mt: -4.5 }}
          display="flex"
          justifyContent="space-between"
          gap={5}
        >
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
            }
            label="Zaufaj urządzeniu"
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
      {newUser ? <PopUpForm></PopUpForm> : <></>}
    </Paper>
  );
}

export default RegisterPage;
