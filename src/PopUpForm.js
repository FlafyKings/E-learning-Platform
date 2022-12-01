import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { redirect, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import useLogout from "./hooks/useLogout";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Box } from "@mui/system";
import { useState } from "react";
import axios from "./api/axios";

const PopUpForm = () => {
  const [open, setOpen] = useState(true);
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth, setAuth, newUser, setNewUser } = useAuth();

  //Variables describing form values
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("Student");
  const login = auth.login;

  //Variables describing alerts
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const signOut = async () => {
    await logout();
    setNewUser(false);
    window.location.replace("/login");
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios
      .post(
        "/popupform",
        JSON.stringify({ firstname, lastname, email, role, login }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
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
    <div>
      <Dialog
        onSubmit={handleSubmit}
        component="form"
        open={open}
        fullScreen
        onClose={handleClose}
      >
        <DialogTitle>Informacje dodatkowe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Aby rozpocząć korzystanie z naszej platformy potrzebujemy kilku
            dodatkowych informacji o Tobie.
          </DialogContentText>
          <Box sx={{ display: "flex", gap: "4rem" }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Imię"
              type="firstname"
              helperText={alertType === "firstname" ? alertMessage : ""}
              error={alertType === "firstname" ? alertMessage : ""}
              onChange={(event) => setFirstname(event.target.value)}
              value={firstname}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              type="lastname"
              helperText={alertType === "lastname" ? alertMessage : ""}
              error={alertType === "lastname" ? alertMessage : ""}
              label="Nazwisko"
              fullWidth
              onChange={(event) => setLastname(event.target.value)}
              value={lastname}
              variant="standard"
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Adres e-mail"
            type="email"
            helperText={alertType === "email" ? alertMessage : ""}
            error={alertType === "email" ? alertMessage : ""}
            fullWidth
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            variant="standard"
            sx={{ mb: "1rem" }}
          />
          <FormControl>
            <FormLabel>Rola</FormLabel>
            <RadioGroup defaultValue="Student" row>
              <FormControlLabel
                labelPlacement="end"
                value="Student"
                onChange={(event) => setRole(event.target.value)}
                control={<Radio />}
                label="Student"
              />
              <FormControlLabel
                value="Teacher"
                onChange={(event) => setRole(event.target.value)}
                control={<Radio />}
                label="Nauczyciel"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={signOut}>Wyloguj</Button>
          <Button type="submit">Wyślij</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopUpForm;
