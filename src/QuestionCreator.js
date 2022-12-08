import {
  Card,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import TabPanel from "./TabPanel";
import DeleteIcon from "@mui/icons-material/Delete";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const QuestionCreator = ({
  listId,
  setItem,
  inputs,
  setInputs,
  handleChange,
}) => {
  const [value, setValue] = React.useState(0);
  const [isActive, setIsActive] = React.useState("");

  const questionName = "question" + listId;
  const answerName1 = "answer1" + listId;
  const answerName2 = "answer2" + listId;
  const answerName3 = "answer3" + listId;
  const answerName4 = "answer4" + listId;

  const handleChangeOfPanel = (event, newValue) => {
    setValue(newValue);
    setInputs((values) => ({
      ...values,
      [answerName1]: "",
      [answerName2]: "",
      [answerName3]: "",
      [answerName4]: "",
    }));
  };

  const deleteQuestion = () => {
    setItem(listId);
    setIsActive("displayNone");
  };

  return (
    <Card
      sx={{
        p: 2,
        width: { sm: 410, lg: 550, xs: 310 },
        maxWidth: 700,
        minWidth: 200,
        minHeight: 150,
        mt: 2,
        mb: 3,
      }}
      className={isActive}
    >
      <Tabs
        value={value}
        onChange={handleChangeOfPanel}
        aria-label="basic tabs example"
        variant="fullWidth"
      >
        <Tab label="Pytanie zamknięte" {...a11yProps(0)} />
        <Tab label="Pytanie otwarte" {...a11yProps(1)} />
      </Tabs>
      <TextField
        fullWidth
        placeholder="Dodaj pytanie"
        required
        name={questionName}
        value={inputs.questionName}
        onChange={handleChange}
        label="Pytanie"
        variant="standard"
        sx={{ mb: 2 }}
      ></TextField>
      <TabPanel value={value} index={0}>
        <FormGroup>
          <FormControlLabel
            sx={{ mb: 0.5 }}
            control={<Checkbox className="creatorCheckbox" name="1" />}
            label={
              <TextField
                className="creatorTextField"
                label="Odpowiedź"
                name={answerName1}
                value={inputs.answerName1}
                onChange={handleChange}
                variant="standard"
              ></TextField>
            }
          />
          <FormControlLabel
            sx={{ mb: 0.5 }}
            control={<Checkbox className="creatorCheckbox" name="1" />}
            label={
              <TextField
                className="creatorTextField"
                label="Odpowiedź"
                name={answerName2}
                value={inputs.answerName2}
                onChange={handleChange}
                variant="standard"
              ></TextField>
            }
          />
          <FormControlLabel
            sx={{ mb: 0.5 }}
            control={<Checkbox className="creatorCheckbox" name="1" />}
            label={
              <TextField
                className="creatorTextField"
                label="Odpowiedź"
                name={answerName3}
                value={inputs.answerName3}
                onChange={handleChange}
                variant="standard"
              ></TextField>
            }
          />
          <FormControlLabel
            sx={{ mb: 0.5 }}
            control={<Checkbox className="creatorCheckbox" name="1" />}
            label={
              <TextField
                className="creatorTextField"
                label="Odpowiedź"
                name={answerName4}
                value={inputs.answerName4}
                onChange={handleChange}
                variant="standard"
              ></TextField>
            }
          />
        </FormGroup>
      </TabPanel>
      <TabPanel value={value} index={1}></TabPanel>
      {listId != 0 ? (
        <Tooltip title="Usuń">
          <IconButton
            sx={{ ml: "auto", mr: 1 }}
            className="deleteIconQuestion"
            onClick={deleteQuestion}
          >
            <DeleteIcon fontSize="medium" color="error" />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default QuestionCreator;
