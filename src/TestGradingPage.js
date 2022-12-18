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

function createData(obj) {
  const description = obj.description;
  const results = [obj.answer_1, obj.answer_2, obj.answer_3, obj.answer_4];
  const array = results.filter((element) => {
    return element !== null;
  });
  return { description, array };
}

const TestGradingPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const login = window.localStorage.getItem("login");
  const testId = window.location.pathname.replace("/test/grade/", "");
  const [test, setTest] = useState([]);
  const [testName, setTestName] = useState();
  const [teacher, setTeacher] = useState("");
  const [testTime, setTestTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [answerArray, setAnswerArray] = useState([]);
  const [checkedValue, setCheckedValue] = useState(false);
  const [value, setValue] = useState("");
  const [testTemplateId, setTestTemplateId] = useState("");

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
    console.log("update", answerArray);
  }, [answerArray]);

  // console.log(test);
  return (
    <Box
      component="form"
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
          <Typography sx={{ color: "rgba(0, 0, 0, 0.6)" }} variant="h5">
            {testName}
          </Typography>
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
                          checked={
                            answerArray[i].close_answer.charAt(j) == "5"
                              ? true
                              : false
                          }
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
      <Button type="submit">Wyślij test</Button>
    </Box>
  );
};

export default TestGradingPage;
