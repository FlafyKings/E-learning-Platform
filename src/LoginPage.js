import * as React from "react";
import { useRef, useState, useEffect } from "react";
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
import axios from "./AxiosInterceptor.js";
import useAuth from "./hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

function LoginPage() {
  //Variables describing users credentials
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  //Variables describing alerts
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRef = useRef();
  const from = location.state?.from?.pathname || "/";

  // const [accessToken, setAccessToken] = useState("");
  // const [roles, setRoles] = useState("");

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     setLogin("");
  //     setPassword("");
  //     setLogged(true);
  //   }
  // }, [auth]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post("/login", JSON.stringify({ login, password }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        //localStorage.setItem("jwtToken", response.data.accessToken); //not safe at all but we dont have https so w/e
        // setAccessToken(response.data.accessToken);
        // setRoles([response.data.roles]);
        // console.log(roles, accessToken);
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
          autoFocus
          label="Login"
          name="login"
          id="login"
          sx={{ mr: 5, ml: 5 }}
          variant="standard"
          size="small"
        />
        <Box sx={{ mr: 5, ml: 5 }}>
          <TextField
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
            control={<Checkbox size="small" />}
            label="Zapamiętaj mnie"
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
    </Paper>
  );
}

export default LoginPage;
