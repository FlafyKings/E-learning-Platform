import { useState, useEffect, useStyles } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React from "react";
import {
  Button,
  Divider,
  Typography,
  Card,
  Box,
  AvatarTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormGroup,
  Checkbox,
} from "@mui/material";

function createData(obj) {
  const description = obj.description;
  const results = [obj.answer_1, obj.answer_2, obj.answer_3, obj.answer_4];
  const array = results.filter((element) => {
    return element !== null;
  });
  console.log("array ----", array);
  return { description, array };
}

const TestPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const login = window.localStorage.getItem("login");
  const testId = window.location.pathname.replace("/test/", "");
  const [test, setTest] = useState();
  const [testName, setTestName] = useState();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTest = async () => {
      try {
        const response = await axiosPrivate.get("/test/" + testId, {
          signal: controller.signal,
          params: { login: login, test: testId },
        });
        console.log(response);
        isMounted && setTest(response.data.test.rows);
        setTestName(response.data.testName.rows[0].name);

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

  console.log(test);
  return (
    <Box
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
          <Typography variant="h5">{testName}</Typography>
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
              <Typography sx={{ mb: 2.5, fontWeight: 500 }}>
                {i + 1}. {row.description}
              </Typography>
              {row.array.length != 0 ? (
                <FormGroup>
                  {row.array.map((x) => (
                    <FormControlLabel
                      control={<Checkbox name="1" />}
                      label={x}
                    />
                  ))}
                </FormGroup>
              ) : (
                <TextField
                  placeholder="Twoja odpowiedź"
                  variant="standard"
                  multiline
                  fullWidth
                ></TextField>
              )}
            </Card>
          ))}
        </>
      ) : (
        <p>Brak testu do wyświetlenia</p>
      )}
    </Box>
  );
};

export default TestPage;
