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
  Collapse,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  FormControl,
  Slider,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import QuestionCreator from "./QuestionCreator";
import { TransitionGroup } from "react-transition-group";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import axiosPrivate from "./api/axios";

const TestCreator = () => {
  const [questionList, setQuestionList] = useState([]);
  const [questionId, setQuestionId] = useState(1);
  const [item, setItem] = useState();
  const [title, setTittle] = useState("");
  const [inputs, setInputs] = useState({});
  const [testTime, setTestTime] = useState(45);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let inputlength = questionId;
    const login = localStorage.getItem("login");
    await axiosPrivate
      .post(
        "/test",
        JSON.stringify({ inputs, title, testTime, inputlength, login }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
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
    //setQuestionList(questionList.filter((i) => i.props.listId !== item));
    let questionName = "question" + item;
    let answerName1 = "answer1" + item;
    let answerName2 = "answer2" + item;
    let answerName3 = "answer3" + item;
    let answerName4 = "answer4" + item;

    delete inputs[questionName];
    delete inputs[answerName1];
    delete inputs[answerName2];
    delete inputs[answerName3];
    delete inputs[answerName4];
  }, [item]);

  const onAddBtnClick = (event) => {
    setQuestionList(
      questionList.concat(
        <QuestionCreator
          key={questionId}
          listId={questionId}
          item={item}
          setItem={setItem}
          inputs={inputs}
          setInputs={setInputs}
          handleChange={handleChange}
        />
      )
    );
    setQuestionId(questionId + 1);
    let questionName = "question" + questionId;
    let answerName1 = "answer1" + questionId;
    let answerName2 = "answer2" + questionId;
    let answerName3 = "answer3" + questionId;
    let answerName4 = "answer4" + questionId;
    setInputs((values) => ({
      ...values,
      [questionName]: "",
      [answerName1]: "",
      [answerName2]: "",
      [answerName3]: "",
      [answerName4]: "",
    }));
  };

  useEffect(() => {
    setQuestionList(
      questionList.concat(
        <QuestionCreator
          key={0}
          listId={0}
          item={item}
          setItem={setItem}
          inputs={inputs}
          setInputs={setInputs}
          handleChange={handleChange}
        />
      )
    );
    setInputs((values) => ({
      ...values,
      question0: "",
      answer10: "",
      answer20: "",
      answer30: "",
      answer40: "",
    }));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        mt: 3,
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        placeholder="Dodaj tytuł"
        name="title"
        onChange={(event) => setTittle(event.target.value)}
        value={title}
        label="Tytuł testu"
        required
        variant="standard"
        sx={{
          mb: 2,
          minWidth: 200,
          width: { sm: 442, lg: 582, xs: 342 },
        }}
      ></TextField>
      <Divider sx={{ width: "100%" }}></Divider>
      <Box
        sx={{
          maxWidth: 700,
          minWidth: 200,
          width: { sm: 442, lg: 582, xs: 342 },
        }}
      >
        <Typography
          sx={{ fontWeight: 500, mt: 1, color: "rgba(0, 0, 0, 0.6)" }}
        >
          Czas trwania testu:
        </Typography>
        <Slider
          onChange={(event) => setTestTime(event.target.value)}
          value={testTime}
          defaultValue={45}
          min={5}
          max={90}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </Box>

      <FormControl>
        <TransitionGroup>
          {questionList.map((question) => (
            <Collapse>{question}</Collapse>
          ))}
        </TransitionGroup>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            key="delete"
            onClick={onAddBtnClick}
            icon={<DeleteIcon />}
          />

          <SpeedDialAction
            key="add"
            onClick={onAddBtnClick}
            icon={<AddIcon />}
          />
          <SpeedDialAction key="save" icon={<SaveIcon />} />
        </SpeedDial>
        <Button onClick={onAddBtnClick}>Dodaj pytanie</Button>
      </FormControl>
      <Button type="submit" sx={{ mb: 5 }}>
        Zapisz test
      </Button>
    </Box>
  );
};

export default TestCreator;
