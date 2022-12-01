import * as React from "react";
import { useState, useEffect } from "react";
import "./Stylesheets/LoginPage.css";
import {
  Box,
  Link,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import axios from "./api/axios";
import useAuth from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PopUpForm from "./PopUpForm";

function LoginPage() {
  //Variables describing users credentials
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  //Variables describing alerts
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [newUser, setNewUser] = useState(false);

  const { setAuth, persist, setPersist } = useAuth(); //deleted auth
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post("/login", JSON.stringify({ login, password }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // setAccessToken(response.data.accessToken);
        // setRoles([response.data.roles]);
        // console.log(roles, accessToken);
        let roles = response.data.roles;
        console.log(roles);
        let accessToken = response.data.accessToken;
        localStorage.setItem("login", login);
        if (response.data.newUser) {
          setNewUser(true);
          setAuth({ login, password, roles, accessToken, newUser });
        } else {
          setAuth({ login, password, roles, accessToken, newUser });
          navigate("/dashboard", true);
        }
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
        <Box sx={{ mr: 5, ml: 5 }}>
          <TextField
            sx={{ mb: 1 }}
            helperText={alertType === "Password" ? alertMessage : ""}
            error={alertType === "Password" ? alertMessage : ""}
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            required
            fullWidth
            label="Hasło"
            name="password"
            id="password"
            type="password"
            variant="standard"
            size="small"
          />
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
            variant="text"
            component={Button}
            underline="none"
            href="/register"
          >
            Utwórz konto
          </Link>
          <Button variant="contained" type="submit">
            Zaloguj
          </Button>
        </Box>
      </Box>
      {newUser ? <PopUpForm></PopUpForm> : <></>}
    </Paper>
  );
}

export default LoginPage;
