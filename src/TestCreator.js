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
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import QuestionCreator from "./QuestionCreator";
import { TransitionGroup } from "react-transition-group";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

const TestCreator = () => {
  const [questionList, setQuestionList] = useState([]);
  const [questionId, setQuestionId] = useState(1);

  const [item, setItem] = useState();

  useEffect(() => {
    setQuestionList(questionList.filter((i) => i.props.listId !== item));
  }, [item]);

  const onAddBtnClick = (event) => {
    setQuestionList(
      questionList.concat(
        <QuestionCreator
          key={questionId}
          listId={questionId}
          item={item}
          setItem={setItem}
        />
      )
    );
    setQuestionId(questionId + 1);
  };

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
    >
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
        Kreator Testu
      </Typography>
      <Divider sx={{ width: "100%" }}></Divider>
      <FormControl>
        <QuestionCreator key={0} listId={0} item={item} setItem={setItem} />
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
        <Button type="submit">Zapisz test</Button>
      </FormControl>
    </Box>
  );
};

export default TestCreator;
