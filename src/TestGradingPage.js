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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Avatar,
} from "@mui/material";
import useAlert from "./hooks/useAlert";
import DoneIcon from "@mui/icons-material/Done";
import CircularProgressLabel from "./CircularProgressLabel";

function createData(obj) {
  const description = obj.description;
  const results = [obj.answer_1, obj.answer_2, obj.answer_3, obj.answer_4];
  const array = results.filter((element) => {
    return element !== null;
  });
  const correct = obj.correct;
  return { description, array, correct };
}

const TestGradingPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const login = window.localStorage.getItem("login");
  const testId = window.location.pathname.replace("/test/grade/", "");
  const [test, setTest] = useState([]);
  const [testName, setTestName] = useState();
  const [student, setStudent] = useState("");
  const [answerArray, setAnswerArray] = useState([]);
  const { setAlert, setAlertMessage, setAlertType } = useAlert();

  //SCORING CONSTS
  const [score, setScore] = useState(0);
  const [fullScore, setFullscore] = useState(0);
  const [maxScoreQuestion, setMaxScoreQuestion] = useState([]);
  const [scoreQuestion, setScoreQuestion] = useState([]);
  const [value, setValue] = useState("");
  const [testTemplateId, setTestTemplateId] = useState("");
  const [openScore, setOpenScore] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const id = name.split("-")[1];

    var scoreTemp = score;
    if (event.target.name in openScore) {
      scoreTemp = scoreTemp - openScore[name];
    }

    let arrayTemp = scoreQuestion.slice();
    arrayTemp[id] = event.target.value;

    setScoreQuestion(arrayTemp);

    setOpenScore((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    setScore(scoreTemp + event.target.value);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTest = async () => {
      try {
        const response = await axiosPrivate.get("/test/grade/" + testId, {
          signal: controller.signal,
          params: { login: login, test: testId },
        });
        console.log(response);
        isMounted && setTest(response.data.test.rows);
        setTestName(response.data.testDetails.rows[0].name);
        setStudent(
          response.data.testDetails.rows[0].first_name +
            " " +
            response.data.testDetails.rows[0].last_name
        );
        console.log(response.data.testDetails.rows);
        setTestTemplateId(response.data.testDetails.rows[0].id);
        setAnswerArray(response.data.answers.rows);
        setTest(
          response.data.test.rows.map((row) => {
            return createData(row);
          })
        );
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getTest();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    var scoreTemp = 0;
    var fullScoreTemp = 0;
    var scorePerQuestionArray = [];
    var maxScorePerQuestionArray = [];
    test.map((row, i) => {
      let maxScoreQuestion = 0;
      let scoreQuestion = 0;
      if (row.correct != "1234") {
        row.array.map((x, j) => {
          if (
            answerArray[i].close_answer.charAt(j) == "5" &&
            row.correct.charAt(j) == "5"
          ) {
            scoreTemp += 1;
            scoreQuestion += 1;
          }
          if (row.correct.charAt(j) == "5") {
            fullScoreTemp += 1;
            maxScoreQuestion += 1;
          }
        });
      } else {
        maxScoreQuestion += 3;
        fullScoreTemp += 3;
      }
      scorePerQuestionArray.push(scoreQuestion);
      maxScorePerQuestionArray.push(maxScoreQuestion);
    });
    setScore(scoreTemp);
    setFullscore(fullScoreTemp);
    setMaxScoreQuestion(maxScorePerQuestionArray);
    setScoreQuestion(scorePerQuestionArray);
  }, [answerArray]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const studentScore = Math.round((score / fullScore) * 100);
    const correct = maxScoreQuestion;
    const answers = scoreQuestion;

    console.log("sedning", studentScore, correct, answers);
    await axiosPrivate
      .post(
        "/test/grade",
        JSON.stringify({
          studentScore,
          answers,
          correct,
          testId,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        setAlert(true);
        setAlertMessage("Oceniono test");
        setAlertType("success");
        navigate("/dashboard");
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

  return (
    <Box
      component="form"
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
      {testName ? (
        <>
          <Card sx={{ p: 2 }}>
            <Typography sx={{ color: "rgba(0, 0, 0, 0.6)" }} variant="h5">
              {testName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                mb: 1.5,
                mt: 1.5,
              }}
            >
              <Typography sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 500 }}>
                <b>Oceniasz:</b> {student}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 500 }}>
                Wynik: {score}/{fullScore}
              </Typography>
              <CircularProgressLabel
                value={Math.round((score / fullScore) * 100)}
              />
            </Box>
          </Card>
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{ mb: 2.5, fontWeight: 500, color: "rgba(0, 0, 0, 0.6)" }}
                >
                  {i + 1}. {row.description}
                </Typography>

                {row.correct === "1234" ? (
                  <FormControl sx={{ minWidth: 80 }} size="small">
                    <InputLabel>Pkt</InputLabel>
                    <Select
                      label="Punkty"
                      defaultValue={0}
                      placeholder="0/3"
                      onChange={handleChange}
                      name={"openScore-" + i}
                    >
                      <MenuItem value={0}>0/3</MenuItem>
                      <MenuItem value={1}>1/3</MenuItem>
                      <MenuItem value={2}>2/3</MenuItem>
                      <MenuItem value={3}>3/3</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: "green",
                    }}
                  >
                    {scoreQuestion[i]}/{maxScoreQuestion[i]}
                  </Typography>
                )}
              </Box>
              {row.array.length != 0 ? (
                <FormGroup>
                  {row.array.map((x, j) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            answerArray[i].close_answer.charAt(j) == "5"
                              ? true
                              : false
                          }
                          sx={{
                            "&:hover": { backgroundColor: "transparent" },
                            "&::before": {
                              fontFamily: "Material Icons",
                              content:
                                row.correct.charAt(j) == "5"
                                  ? '"done"'
                                  : '"close"',
                              visibility:
                                row.correct.charAt(j) != "5" &&
                                answerArray[i].close_answer.charAt(j) != "5"
                                  ? "hidden"
                                  : "",
                            },

                            "&.Mui-checked": {
                              color:
                                row.correct.charAt(j) == "5"
                                  ? "#54c944"
                                  : "#e84f4f",
                            },
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
                  value={answerArray[i].open_answer}
                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                ></TextField>
              )}
            </Card>
          ))}
        </>
      ) : (
        <p>Brak testu do wyświetlenia</p>
      )}
      <Button type="submit">Wystaw ocenę</Button>
    </Box>
  );
};

export default TestGradingPage;
