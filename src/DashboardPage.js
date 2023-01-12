import * as React from "react";
import { useState } from "react";
import "./Stylesheets/LoginPage.css";
import { Button, Link, Box, Typography } from "@mui/material";
import axios from "./api/axios";
import Users from "./Users";
import useLogout from "./hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useEffect } from "react";
import studentImage from "./images/image.png";

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "#343a40", fontWeight: 400 }} variant="h2">
          Przeprowadzaj zajęcia
        </Typography>
        <Typography sx={{ color: "#343a40", fontWeight: 400 }} variant="h2">
          szybko i bez obaw!
        </Typography>
        <Typography sx={{ color: "#9da9bb" }} variant="h6">
          Nasza platofrma uczelniana do zdalnych testów pozwoli
        </Typography>
        <Typography sx={{ color: "#9da9bb" }} variant="h6">
          Ci wejść na wyższy poziom e-learningu!
        </Typography>
        <Button
          sx={{ mt: 2 }}
          onClick={() => navigate("/groups/")}
          variant="contained"
        >
          {" "}
          Przejdź do swoich grup
        </Button>
      </Box>
      <img className="imageDashboard" src={studentImage}></img>
    </Box>
  );
}

export default DashboardPage;
