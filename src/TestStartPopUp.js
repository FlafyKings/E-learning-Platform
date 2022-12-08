import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const TestStartPopUp = () => {
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };

  const handleRedirect = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
          Test z inżynierii obliczeniowej
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "left",
            minWidth: 400,
          }}
        >
          <Typography textAlign="left">
            <b>Czas na rozwiązanie testu:</b> 45 minut
          </Typography>
          <Typography textAlign="left">
            <b>Prowadzący:</b> Imie i Nazwisko
          </Typography>
          <Typography textAlign="left">
            <b>Data rozpoczęcia testu:</b> 21.09.2022 18:45
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRedirect}>Strona główna</Button>
          <Button onClick={handleClose}>Rozpocznij test</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TestStartPopUp;
