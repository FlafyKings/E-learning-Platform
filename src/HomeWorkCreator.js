import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useEffect, useRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  plPL,
  LocalizationProvider,
  DateTimePicker,
} from "@mui/x-date-pickers";
import "dayjs/locale/pl";
import { useState } from "react";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "./hooks/useAlert";

const HomeWorkCreator = () => {
  const [testDate, setTestDate] = useState(dayjs().add(1, "day"));
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const groupId = useRef();
  const login = window.localStorage.getItem("login");

  groupId.current = window.location.pathname.replace("/homeworkCreator/", "");

  const { setAlert, setAlertMessage, setAlertType } = useAlert();

  const handleChange = (newValue) => {
    console.log(newValue);
    setTestDate(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let groupIdCurrent = groupId.current;
    await axiosPrivate
      .post(
        "/homework/",
        JSON.stringify({ groupIdCurrent, text, title, testDate, login }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Halo", response);
        setAlert(true);
        setAlertType("success");
        setAlertMessage("Dodano zadanie do grupy!");
        navigate("/dashboard");
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.6)", mt: 4, mb: 3 }}
      >
        Stwórz zadanie domowe
      </Typography>{" "}
      <Divider sx={{ width: "100%", mb: 4 }}></Divider>
      <Card
        sx={{
          width: 400,
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Typography
          sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", mt: 4, mb: 3 }}
        >
          Zadanie domowe
        </Typography>
        <TextField
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ width: "80%" }}
          label="Tytuł"
        ></TextField>
        <TextField
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Treść"
          multiline
          rows={4}
          sx={{ width: "80%" }}
        ></TextField>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="pl"
          localeText={
            plPL.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <DateTimePicker
            renderInput={(params) => (
              <TextField sx={{ width: "80%" }} {...params} />
            )}
            label="Data i czas testu"
            value={testDate}
            onChange={handleChange}
            minDateTime={dayjs()}
          />
        </LocalizationProvider>
        <Button
          sx={{ mb: 2, mt: "auto", mr: 2, ml: "auto" }}
          variant="contained"
          startIcon={<AddIcon></AddIcon>}
          onClick={handleSubmit}
        >
          Dodaj
        </Button>
      </Card>
    </Box>
  );
};

export default HomeWorkCreator;
