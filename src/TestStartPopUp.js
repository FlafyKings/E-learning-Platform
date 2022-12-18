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
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

const TestStartPopUp = (props) => {
  const { testTime, teacher, testName, startDate } = props;
  const [open, setOpen] = useState(true);

  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    months: [
      "Stycznia ",
      "Lutego",
      "Marca",
      "Kwietnia",
      "Maja",
      "Czerwieca",
      "Lipieca",
      "Sierpnia",
      "Września",
      "Października",
      "Listopada",
      "Grudnia",
    ],
    weekdays: [
      "Niedziela",
      "Poniedziałek",
      "Wtorek",
      "Środa",
      "Czwartek",
      "Piątek",
      "Sobota",
    ],
  });

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
          {testName}
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
            <b>Czas na rozwiązanie testu:</b> {testTime} minut
          </Typography>
          <Typography textAlign="left">
            <b>Prowadzący:</b> {teacher}
          </Typography>
          <Typography textAlign="left">
            <b>Data rozpoczęcia testu:</b>{" "}
            {dayjs(startDate).format("dddd DD MMMM H:mm")}
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
