import * as React from "react";
import { Button } from "@mui/material";

function UnauthorizedPage() {
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
