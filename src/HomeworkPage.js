import React from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";

const HomeworkPage = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const homeworkId = useRef();
  const { setAlert, setAlertMessage, setAlertType } = useAlert();
  const [description, setDescription] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const login = window.localStorage.getItem("login");
  const [rows, setRows] = useState([]);

  homeworkId.current = window.location.pathname.replace("/homework/solve/", "");

  const handleSubmit = async (event) => {
    event.preventDefault();

    let homeworkIdCurrent = homeworkId.current;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", description);
    formData.append("login", login);
    formData.append("homeworkIdCurrent", homeworkIdCurrent);
    await axiosPrivate
      .post("/homework/solve/", formData, {
        withCredentials: true,
      })
      .then((response) => {
        setAlert(true);
        setAlertType("success");
        setAlertMessage("Dodano rozwiązanie!");
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

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const deleteFile = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getGroup = async () => {
      try {
        const response = await axiosPrivate.get(
          "/homework/solve/" + homeworkId.current,
          {
            signal: controller.signal,
            params: { login: login, homeworkId: homeworkId.current },
          }
        );
        console.log(response);
        isMounted && setRows(response.data.homework.rows[0]);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getGroup();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

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
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          sx={{
            color: "rgba(0, 0, 0, 0.6)",
            mt: 4,
            mb: 3,
          }}
        >
          {rows?.name ? rows.name[0].toUpperCase() + rows.name.slice(1) : ""}
        </Typography>
        <Divider sx={{ width: "100%" }}></Divider>
        <Typography
          sx={{
            fontWeight: 500,
            color: "rgba(0, 0, 0, 0.6)",
            ml: 3,
            mr: "auto",
            mt: 1,
          }}
        >
          Polecenie:{" "}
        </Typography>
        <Typography
          textAlign="left"
          sx={{
            fontWeight: 500,
            color: "rgba(0, 0, 0, 0.6)",
            ml: 3,
            mt: 1,
            mb: 3,
            mr: 3,
          }}
        >
          {rows.question}
        </Typography>
        <Divider sx={{ mb: 4, width: "100%" }}></Divider>
        <TextField
          sx={{
            width: "80%",
            ml: 3,
            mt: 1,
            mb: 3,
            mr: 3,
          }}
          multiline
          rows={4}
          label="Odpowiedź"
          onChange={(e) => setDescription(e.target.value)}
        ></TextField>
        {selectedFile ? (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography sx={{ verticalAlign: "middle" }}>
              {selectedFile ? selectedFile.name : ""}
            </Typography>
            <IconButton onClick={deleteFile} sx={{ pt: 0 }}>
              <DeleteIcon color="error"></DeleteIcon>
            </IconButton>
          </Box>
        ) : (
          <></>
        )}

        <Button
          variant="contained"
          component="label"
          startIcon={<AttachFileIcon></AttachFileIcon>}
        >
          Dodaj plik
          <input type="file" hidden onChange={handleFileSelect} />
        </Button>
        <Button
          sx={{ mb: 2, mt: "auto", mr: 2, ml: "auto" }}
          variant="contained"
          startIcon={<AddIcon></AddIcon>}
          onClick={handleSubmit}
        >
          Wyślij zadanie
        </Button>
      </Card>
    </Box>
  );
};

export default HomeworkPage;
