import * as React from "react";
import { useState } from "react";
import "./Stylesheets/LoginPage.css";
import { Button, Link } from "@mui/material";
import axios from "./api/axios";
import Users from "./Users";
import useLogout from "./hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useEffect } from "react";

function DashboardPage() {
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  axios
    .get("/dashboard")
    .then((response) => {
      setResult(response.data.login);
      console.log(response.data.login);
    })
    .catch((err) => {
      console.log(err);
    });
  return (
    <div>
      <Users></Users>
      <Link href="/chat">Chat</Link>
      <Button onClick={signOut} variant="contained">
        Wyloguj
      </Button>
      <h1>{result}</h1>
    </div>
  );
}

export default DashboardPage;
