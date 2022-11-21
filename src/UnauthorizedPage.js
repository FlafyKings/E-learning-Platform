import * as React from "react";
import { Button } from "@mui/material";
import useLogout from "./hooks/useLogout";
import { useNavigate } from "react-router-dom";

function UnauthorizedPage() {
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const handleReturn = (event) => {
    window.location.replace("/dashboard");
  };

  return (
    <div>
      <h1>Nieautoryzowany dostęp</h1>
      <Button onClick={signOut} variant="contained">
        Wyloguj
      </Button>
      <Button onClick={handleReturn} variant="contained">
        Powrót na stronę główną
      </Button>
    </div>
  );
}

export default UnauthorizedPage;
