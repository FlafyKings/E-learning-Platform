import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAlert from "./hooks/useAlert";
import { Box } from "@mui/system";

const AddStudentPopUp = ({ open, handlePopUp, groupId, group, setOpen }) => {
  const [students, setStudents] = useState();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState();
  const { setAlert, setAlertMessage, setAlertType } = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axiosPrivate
      .post("/students", JSON.stringify({ values }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Halo", response);
        setAlert(true);
        setAlertType("success");
        setAlertMessage("Wysłano wiadomość!");
        setOpen(false);
      })
      .catch((error) => {
        //Error handling
        if (error.response) {
          //The client was given an error response

          if (!error.response.data.type) {
            if (error.response.status >= 400) {
              console.log("error");
            } else if (error.response.status >= 200) {
              console.log("error");
            }
          } else {
            console.log("error");
          }
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          //Other errors
          console.log("Error", error.message);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getStudents = async () => {
      try {
        const response = await axiosPrivate.get("/students", {
          signal: controller.signal,
        });
        isMounted && setStudents(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getStudents();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log(values);
  }, [values]);

  useEffect(() => {
    console.log(text);
  }, [text]);

  useEffect(() => {
    console.log(title);
  }, [title]);

  return (
    <div>
      <Dialog
        className="mailDialogClass"
        component="form"
        open={open}
        onClose={handlePopUp}
      >
        <DialogTitle sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
          Wyślij wiadomość mailową
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "left",
            minWidth: 300,
          }}
        >
          <Typography textAlign="left">Wpisz imie lub naziwsko</Typography>
          {students ? (
            <Autocomplete
              options={students}
              onChange={(event, value) => setValues(value)}
              getOptionLabel={(option) =>
                option.first_name
                  ? option.first_name + " " + option.last_name
                  : ""
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Wybierz odbiorce"
                  placeholder="Studenci"
                />
              )}
            />
          ) : (
            <></>
          )}
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            label="Tytuł wiadomości"
            placeholder="Tytuł"
          ></TextField>
          <TextField
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={4}
            label="Treść wiadomości"
            placeholder="Treść "
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopUp}>Zamknij</Button>
          <Button onClick={handleSubmit}>Wyślij wiadomość</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddStudentPopUp;
