import React from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useEffect, useRef } from "react";
import "dayjs/locale/pl";
import { useState } from "react";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "./hooks/useAlert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { ButtonGroup } from "@mui/material";
import fileDownload from "js-file-download";
import { Download } from "@mui/icons-material";

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
  const [score, setScore] = useState(0);
  const [file, setFile] = useState();
  var blobObject = "";

  homeworkId.current = window.location.pathname.replace("/homework/grade/", "");

  const handleChange = (event) => {
    setScore(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let homeworkIdCurrent = homeworkId.current;
    let scorePercentage = (score / 3) * 100;
    await axiosPrivate
      .post(
        "/homework/grade/",
        JSON.stringify({ homeworkIdCurrent, scorePercentage }),
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setAlert(true);
        setAlertType("success");
        setAlertMessage("Dodano ocenę!");
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

  const deleteFile = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getGroup = async () => {
      try {
        const response = await axiosPrivate.get(
          "/homework/file/" + homeworkId.current,
          {
            signal: controller.signal,
            params: {
              login: login,
              homeworkId: homeworkId.current,
              file: true,
            },
            responseType: "blob",
          }
        );
        isMounted && setFile(response.data);
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

  useEffect(() => {
    if (rows) {
      let isMounted = true;
      const controller = new AbortController();
      const getGroup = async () => {
        try {
          const response = await axiosPrivate.get(
            "/homework/grade/" + homeworkId.current,
            {
              signal: controller.signal,
              params: {
                login: login,
                homeworkId: homeworkId.current,
                file: false,
              },
            }
          );
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
    }
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
        <Typography
          sx={{
            color: "rgba(0, 0, 0, 0.6)",
            mr: "auto",
            ml: 3,
            mb: 2,
          }}
        >
          <b>Student: </b>
          {rows?.first_name + " " + rows?.last_name}
        </Typography>
        <Typography
          sx={{
            color: "rgba(0, 0, 0, 0.6)",
            mr: "auto",
            ml: 3,
            mb: 2,
          }}
        >
          <b>Oddano: </b>{" "}
          {dayjs(rows?.timestamp).add(1, "hour").format("DD MMMM HH:mm")}
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

        <TextField
          sx={{ width: "80%" }}
          multiline
          helperText="Odpowiedź studenta"
          rows={4}
          value={rows?.description}
        ></TextField>
        {file ? (
          <Button
            startIcon={<Download></Download>}
            onClick={() => fileDownload(file, "rozwiazanie.jpg")}
          >
            Pobierz rozwiązanie
          </Button>
        ) : (
          <></>
        )}

        <FormControl sx={{ mt: 2, minWidth: 80 }} size="small">
          <InputLabel>Pkt</InputLabel>
          <Select
            label="Ocena"
            defaultValue={0}
            placeholder="0/3"
            onChange={handleChange}
            name={"score"}
          >
            <MenuItem value={0}>0/3</MenuItem>
            <MenuItem value={1}>1/3</MenuItem>
            <MenuItem value={2}>2/3</MenuItem>
            <MenuItem value={3}>3/3</MenuItem>
          </Select>
        </FormControl>

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
