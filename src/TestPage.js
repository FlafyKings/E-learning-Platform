import { useState, useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import TestStartPopUp from "./TestStartPopUp";
import {
  Divider,
  Typography,
  Card,
  Box,
  FormControlLabel,
  TextField,
  FormGroup,
  Checkbox,
  Button,
} from "@mui/material";
import useAlert from "./hooks/useAlert";
import dayjs from "dayjs";
import Countdown from "./Countdown";

function createData(obj) {
  const description = obj.description;
  const results = [obj.answer_1, obj.answer_2, obj.answer_3, obj.answer_4];
  const array = results.filter((element) => {
    return element !== null;
  });
  return { description, array };
}

const TestPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const login = window.localStorage.getItem("login");
  const testId = window.location.pathname.replace("/test/solve/", "");
  const [test, setTest] = useState([]);
  const [testName, setTestName] = useState();
  const [teacher, setTeacher] = useState("");
  const [testTime, setTestTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [answerArray, setAnswerArray] = useState([]);
  const [value, setValue] = useState("");
  const { setAlert, setAlertMessage, setAlertType } = useAlert();
  const [testTemplateId, setTestTemplateId] = useState("");

  const answerArrayTemp = [];

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTest = async () => {
      try {
        const response = await axiosPrivate.get("/test/solve/" + testId, {
          signal: controller.signal,
          params: { login: login, test: testId },
        });
        console.log(response);
        isMounted && setTest(response.data.test.rows);
        setTestName(response.data.testDetails.rows[0].name);
        console.log(response.data.testDetails.rows);
        setTeacher(
          response.data.testDetails.rows[0].first_name +
            " " +
            response.data.testDetails.rows[0].last_name
        );
        setTestTime(response.data.testDetails.rows[0].time);
        setStartDate(response.data.testDetails.rows[0].date);
        setTestTemplateId(response.data.testDetails.rows[0].id);

        setTest(
          response.data.test.rows.map((row) => {
            return createData(row);
          })
        );
      } catch (err) {
        console.error(err);
        navigate("/dashboard", { state: { from: location }, replace: true });
        setAlert(true);
        setAlertMessage(err.response.data.message);
        setAlertType("error");
      }
    };

    getTest();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // let inputlength = questionId;
    let testLength = test.length;
    const login = localStorage.getItem("login");
    await axiosPrivate
      .post(
        "/test/solve",
        JSON.stringify({
          answerArray,
          testId,
          login,
          testTemplateId,
          testLength,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        setAlert(true);
        setAlertMessage("Zapisano podejście do testu");
        setAlertType("success");
        navigate("/dashboard");

        //dodac dialog box albo osobna strone
      })
      .catch((error) => {
        //Error handling
        if (error.response) {
          //The client was given an error response

          if (!error.response.data.type) {
            if (error.response.status >= 400) {
              //setAlertType("error");
              console.log("error");
            } else if (error.response.status >= 200) {
              //setAlertType("success");
              console.log("error");
            }
          } else {
            //setAlertType(error.response.data.type);
            console.log("error");
          }
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          //console.log(alertMessage);
        } else if (error.request) {
          //The client never received a response
          console.log(error.request);
        } else {
          //Other errors
          console.log("Error", error.message);
        }
      });
  };

  useEffect(() => {
    console.log("update", answerArray);
  }, [answerArray]);

  // console.log(test);
  return (
    <Box
      component="form"
      name="testSolvingForm"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        mt: 7,
      }}
    >
      <TestStartPopUp
        teacher={teacher}
        testTime={testTime}
        testName={testName}
        startDate={startDate}
      ></TestStartPopUp>
      {testName ? (
        <>
          <Typography sx={{ color: "rgba(0, 0, 0, 0.6)" }} variant="h5">
            {testName}
          </Typography>
          <Countdown
            targetDate={dayjs(startDate).add(parseInt(testTime), "minute")}
          ></Countdown>
          <Divider sx={{ width: "100%", mb: 2, mt: 2 }}></Divider>

          {test.map((row, i) => (
            <Card
              sx={{
                p: 2,
                width: { sm: 410, lg: 550, xs: 310 },
                maxWidth: 700,
                minWidth: 200,
                mt: 2,
                mb: 3,
              }}
            >
              <Typography
                sx={{ mb: 2.5, fontWeight: 500, color: "rgba(0, 0, 0, 0.6)" }}
              >
                {i + 1}. {row.description}
              </Typography>
              {row.array.length != 0 ? (
                <FormGroup>
                  {row.array.map((x, j) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={answerArray}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAnswerArray([
                                ...answerArray,
                                {
                                  id: i + "" + j,
                                  state: true,
                                },
                              ]);
                            } else {
                              setAnswerArray(
                                answerArray.filter(
                                  (answer) => answer.id !== i + "" + j
                                )
                              );
                            }
                          }}
                        />
                      }
                      label={x}
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                    />
                  ))}
                </FormGroup>
              ) : (
                <TextField
                  placeholder="Twoja odpowiedź"
                  variant="standard"
                  multiline
                  fullWidth
                  value={
                    answerArray.filter((obj) => {
                      return obj.id === "open-" + i;
                    }).text
                  }
                  onChange={(e) => {
                    var temp = answerArray.find((x) => x.id == "open-" + i);
                    console.log(temp);
                    temp
                      ? (temp.text = e.target.value)
                      : setAnswerArray([
                          ...answerArray,
                          {
                            id: "open-" + i,
                            text: e.target.value,
                          },
                        ]);
                  }}
                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                ></TextField>
              )}
            </Card>
          ))}
        </>
      ) : (
        <p>Brak testu do wyświetlenia</p>
      )}
      <Button type="submit">Wyślij test</Button>
    </Box>
  );
};

export default TestPage;
