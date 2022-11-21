import * as React from "react";
import { useState } from "react";
import "./Stylesheets/LoginPage.css";
import { Button, Link } from "@mui/material";
import axios from "./api/axios";
import Users from "./Users";
import useLogout from "./hooks/useLogout";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [result, setResult] = useState("");
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
      {" "}
      <Users></Users>
      <Link href="/chat">Chat</Link>
      <Button onClick={signOut} variant="contained">
        Wyloguj
      </Button>{" "}
      <h1>{result}</h1>{" "}
    </div>
  );
}

export default DashboardPage;
