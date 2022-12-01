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

const QuestionCreator = ({ listId, setItem }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="fullWidth"
      >
        <Tab label="Pytanie zamknięte" {...a11yProps(0)} />
        <Tab label="Pytanie otwarte" {...a11yProps(1)} />
      </Tabs>
      <TextField
        fullWidth
        placeholder="Dodaj pytanie"
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
            onClick={() => setItem(listId)}
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
