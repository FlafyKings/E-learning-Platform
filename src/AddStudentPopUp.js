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

const AddStudentPopUp = ({ open, setOpen, groupId, group }) => {
  const [students, setStudents] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState();
  const { setAlert, setAlertMessage, setAlertType } = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (group) {
      var result = group.find((item) => item.id == groupId.current)[
        "students_count"
      ];
      group.find((item) => item.id == groupId.current)["students_count"] =
        parseInt(result) + values.length;
    }
    let gruopIdCurrent = groupId.current;
    await axiosPrivate
      .post("/students", JSON.stringify({ gruopIdCurrent, values }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Halo", response);
        setAlert(true);
        setAlertType("success");
        setAlertMessage("Dodano studenta do grupy!");
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
      let gruopIdCurrent = groupId.current;
      try {
        const response = await axiosPrivate.get(
          "/students/" + gruopIdCurrent,
          JSON.stringify({ gruopIdCurrent }),
          {
            signal: controller.signal,
            params: { groupId: gruopIdCurrent },
          }
        );
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog component="form" open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
          Dodaj ucznia do grupy
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
            Wpisz imie lub naziwsko ucznia
          </Typography>
          {students ? (
            <Autocomplete
              multiple
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
                  label="Wybierz studenta"
                  placeholder="Studenci"
                />
              )}
            />
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Zamknij</Button>
          <Button onClick={handleSubmit}>Dodaj ucznia</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddStudentPopUp;
