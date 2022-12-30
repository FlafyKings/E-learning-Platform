import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState, useEffect } from "react";
import SendMailPopUp from "./SendMailPopUp";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import MailTable from "./MailTable";
import {
  Card,
  TextField,
  FormGroup,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import TabPanel from "./TabPanel";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function createData(obj) {
  const id = obj.id;
  const sender_id = obj.sender_id;
  const receiver_id = obj.receiver_id;
  const text = obj.text;
  const title = obj.title;
  const timestamp = obj.timestamp;
  const name = obj.first_name + " " + obj.last_name;
  return { id, sender_id, receiver_id, text, title, timestamp, name };
}

const MailPage = () => {
  const [open, setOpen] = useState(false);
  const login = window.localStorage.getItem("login");
  const [rows, setRows] = useState([]);
  const [value, setValue] = useState(0);
  const [rowsSent, setRowsSent] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeOfPanel = (event, newValue) => {
    setValue(newValue);
  };

  const handlePopUp = () => {
    setOpen(!open);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getMail = async () => {
      try {
        const response = await axiosPrivate.get("/mail/" + login, {
          signal: controller.signal,
          params: { login: login },
        });
        console.log(response);
        isMounted && setRows(response.data.mail.rows);

        setRows(
          response.data.mail.rows.map((row) => {
            return createData(row);
          })
        );
        setRowsSent(
          response.data.sentMail.rows.map((row) => {
            return createData(row);
          })
        );
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getMail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Box>
      {open ? (
        <SendMailPopUp handlePopUp={handlePopUp} open={open}></SendMailPopUp>
      ) : (
        <></>
      )}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          textAlign: "center",
          mt: 2,
          color: "rgba(0, 0, 0, 0.6)",
        }}
      >
        Skrzynka Pocztowa
      </Typography>
      <Button
        sx={{ mr: 2, ml: 2 }}
        onClick={handlePopUp}
        variant="contained"
        endIcon={<SendIcon></SendIcon>}
      >
        Napisz
      </Button>
      <Button
        variant="contained"
        onClick={() => window.location.reload(true)}
        endIcon={<RefreshIcon></RefreshIcon>}
      >
        Odbierz
      </Button>
      <Divider sx={{ mt: 2 }}></Divider>
      <Tabs
        sx={{ mb: 1 }}
        value={value}
        onChange={handleChangeOfPanel}
        aria-label="basic tabs example"
        variant="fullWidth"
      >
        <Tab label="Odebrane" {...a11yProps(0)} />
        <Tab label="Wysłane" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {" "}
        <MailTable rows={rows} setRows={setRows}></MailTable>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {" "}
        <MailTable rows={rowsSent} setRows={setRowsSent}></MailTable>
      </TabPanel>
    </Box>
  );
};

export default MailPage;
