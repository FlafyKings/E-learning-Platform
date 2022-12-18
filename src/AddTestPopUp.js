import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import useAlert from "./hooks/useAlert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  plPL,
  LocalizationProvider,
  DateTimePicker,
} from "@mui/x-date-pickers";
import "dayjs/locale/pl";
import { Stack } from "@mui/system";

const AddTestPopUp = ({ open, setOpen, groupId, group }) => {
  const [tests, setTests] = useState();
  const [testId, setTestId] = useState();
  const [testDate, setTestDate] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState();
  const login = window.localStorage.getItem("login");
  const [value, setValue] = React.useState(dayjs().add(1, "day"));

  const { setAlert, setAlertMessage, setAlertType } = useAlert();

  const handleChange = (newValue) => {
    setTestDate(newValue);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getTests = async () => {
      try {
        const response = await axiosPrivate.get(
          "/test/teacher/" + login,
          JSON.stringify({ login }),
          {
            signal: controller.signal,
            params: { login: login },
          }
        );
        isMounted && setTests(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getTests();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let gruopIdCurrent = groupId.current;
    await axiosPrivate
      .post(
        "/test/" + gruopIdCurrent,
        JSON.stringify({ groupId, testId, testDate }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Halo", response);
        setAlert(true);
        setAlertType("success");
        setAlertMessage("Dodano test do grupy!");
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog component="form" open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
          Dodaj test do grupy
        </DialogTitle>
        <DialogContent sx={{ width: { xs: 250, sm: 400 } }}>
          <Typography textAlign="left" sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
            Wybierz test oraz date
          </Typography>
          {tests ? (
            <Stack>
              <Autocomplete
                sx={{ mb: 3 }}
                options={tests}
                onChange={(event, value) => setTestId(value)}
                getOptionLabel={(option) => (option.name ? option.name : "")}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Wybierz test"
                    placeholder="Testy"
                  />
                )}
              />
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pl"
                localeText={
                  plPL.components.MuiLocalizationProvider.defaultProps
                    .localeText
                }
              >
                <DateTimePicker
                  renderInput={(params) => <TextField {...params} />}
                  label="Data i czas testu"
                  value={testDate}
                  onChange={handleChange}
                  minDateTime={dayjs()}
                />
              </LocalizationProvider>
            </Stack>
          ) : (
            <></>
          )}
          <Typography
            textAlign="center"
            sx={{ color: "rgba(0, 0, 0, 0.6)", mt: 3, mb: 2 }}
          >
            lub
          </Typography>
          <Button
            onClick={() => navigate("/testCreator")}
            fullWidth
            sx={{ mb: 3 }}
          >
            Utwórz nowy test
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Zamknij</Button>
          <Button onClick={handleSubmit}>Dodaj test</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddTestPopUp;
