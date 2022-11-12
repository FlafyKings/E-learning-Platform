import * as React from "react";
import { useState } from "react";
import { Checkbox } from "@mui/material";
import { TextField } from "@mui/material";
import "./Stylesheets/LoginPage.css";
import { Paper, Button, Box, FormControlLabel } from "@mui/material";
import axios from "./AxiosInterceptor.js";

function DashboardPage() {
  const [result, setResult] = useState("");

  const handleClick = (event) => {
    localStorage.setItem("jwtToken", "");
    window.location.replace("/login");
  };

  axios
    .get("/dashboard")
    .then((response) => {
      setResult(response.data.login);
    })
    .catch((err) => {
      console.log(err);
    });
  return (
    <div>
      {" "}
      <Button onClick={handleClick} variant="contained">
        Wyloguj
      </Button>{" "}
      <h1>{result}</h1>{" "}
    </div>
  );
}

export default DashboardPage;
