import * as React from "react";
import axios from "./AxiosInterceptor.js";
import { Button } from "@mui/material";
import { useState } from "react";

function UnauthorizedPage() {
  const [result, setResult] = useState("");

  const handleClick = (event) => {
    localStorage.setItem("jwtToken", "");
    window.location.replace("/login");
  };

  const handleReturn = (event) => {
    window.location.replace("/dashboard");
  };

  return (
    <div>
      <h1>Nieautoryzowany dostęp</h1>
      <Button onClick={handleClick} variant="contained">
        Wyloguj
      </Button>
      <Button onClick={handleReturn} variant="contained">
        Powrót na stronę główną
      </Button>
    </div>
  );
}

export default UnauthorizedPage;
