import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { Avatar, Button, Drawer, TextField } from "@mui/material";
import dayjs from "dayjs";
import {
  Divider,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const socket = socketio("http://localhost:3000/chat/", {
  transports: ["websocket"],
});

function createData(obj) {
  //const counter = 2;
  const id = obj.id;
  const name = obj.name;
  const owner = obj.first_name + " " + obj.last_name;
  const ownerLogin = obj.login;
  const students_count = obj.students_count;
  return { id, name, owner, students_count, ownerLogin };
}

function createMessage(obj) {
  const login = obj.login;
  const receiver_id = obj.receiver_id;
  const message = obj.text;
  const timestamp = obj.timestamp;
  const first_name = obj.first_name;
  const last_name = obj.last_name;
  return { login, receiver_id, message, timestamp, first_name, last_name };
}

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState([]);
  const [name, setName] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(800);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const login = localStorage.getItem("login");

  //GETTING INFO FROM THE SERVER
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsersGroups = async () => {
      try {
        const response = await axiosPrivate.get("/group", {
          signal: controller.signal,
          params: { login: login },
        });
        isMounted && setGroup(response.data.rows);
        setGroup(
          response.data.rows.map((row) => {
            return createData(row);
          })
        );
        setCurrentChat({
          id: response.data.rows[0].id,
          name: response.data.rows[0].name,
          owner:
            response.data.rows[0].first_name +
            " " +
            response.data.rows[0].last_name,
          students_count: response.data.rows[0].students_count,
        });
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsersGroups();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  //GETTING CHAT MESSAGES
  useEffect(() => {
    if (currentChat) {
      let isMounted = true;
      const controller = new AbortController();

      const getGroupMessages = async () => {
        try {
          const response = await axiosPrivate.get("/chat/" + currentChat.id, {
            signal: controller.signal,
            params: { login: login, groupId: currentChat.id },
          });
          isMounted && setChatMessages(response.data.messages.rows);
          setMessages(
            response.data.messages.rows.map((row) => {
              return createMessage(row);
            })
          );
          console.log(response.data);
          setName(
            response.data.name.rows[0].first_name +
              " " +
              response.data.name.rows[0].last_name
          );
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      getGroupMessages();

      return () => {
        isMounted = false;
        controller.abort();
      };
    }
  }, [currentChat]);

  useEffect(() => {
    console.log(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    socket.on("new message", (obj) => {
      console.log(obj);
      console.log(messages);
      setMessages([...messages, obj]);
    });
  }, [messages]);

  const handleSendMessage = () => {
    let timestamp = dayjs();
    console.log(timestamp);
    let obj = {
      message: message,
      login: login,
      timestamp: timestamp,
      receiver_id: currentChat.id,
      name: name,
    };
    socket.emit("send message", obj);
    setMessage("");
  };

  const handleCloseDrawer = () => {
    setOpen(!open);
  };

  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      console.log("invalid username");
    }
  });

  socket.on("users", (users) => {
    console.log(users);
  });

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  useEffect(() => {
    console.log(currentChat);
  }, [currentChat]);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {group ? (
        <TableContainer
          component={width > 500 ? Paper : Drawer}
          open={open}
          sx={{
            borderRadius: 0,
            width: "20%",
            borderRight: "1px solid rgba(0, 0, 0, 0.6)",
          }}
        >
          <Table sx={{ Width: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">
                  Nazwa{" "}
                  {width < 501 ? (
                    <IconButton
                      onClick={handleCloseDrawer}
                      sx={{ position: "absolute", top: 10, right: 5 }}
                    >
                      <ArrowForwardIosIcon fontSize="small"></ArrowForwardIosIcon>
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="tableBodyGroups">
              {group.map((row, i) => (
                <TableRow
                  className="groupTableHover"
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    onClick={() => {
                      setCurrentChat({ id: row.id, name: row.name });
                      setOpen(!open);
                    }}
                    align="left"
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setCurrentChat({ id: row.id, name: row.name });
                      setOpen(!open);
                    }}
                    align="center"
                  >
                    {row.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}
      <Box
        sx={{
          width: "60%",
          minWidth: 375,
          height: "92vh",
          backgroundColor: "white",
          mr: "auto",
          ml: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", display: "flex" }}>
          {width < 501 ? (
            <IconButton onClick={handleCloseDrawer}>
              <ArrowBackIosNewIcon fontSize="small"></ArrowBackIosNewIcon>
            </IconButton>
          ) : (
            <></>
          )}
          <Typography
            sx={{
              textAlign: "left",
              fontWeight: 500,
              color: "rgba(0, 0, 0, 0.6)",
              ml: 3,
              mt: 1,
              mb: 1,
            }}
          >
            Czat: {currentChat?.name ? currentChat.name : "Ładowanie"}
          </Typography>
        </Box>
        <Divider sx={{ width: "100%", heigth: 3 }}></Divider>

        <Box sx={{ width: "100%", height: "100%", mt: 3 }}>
          <Box>
            {messages.map((m) =>
              m.login == login ? (
                <Box
                  sx={{
                    display: "flex",
                    backgroundColor: "white",
                    height: "100%",
                    justifyContent: "flex-end",
                    mr: 2,
                    mt: 1,
                    mb: 1,
                  }}
                >
                  <Paper sx={{ ml: 2, pt: 1, pb: 1, pl: 2, pr: 2 }}>
                    <Typography>{m.message}</Typography>
                  </Paper>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    backgroundColor: "white",
                    height: "100%",
                    justifyContent: "flex-start",
                    ml: 2,
                    mt: 1,
                    mb: 1,
                  }}
                >
                  <Avatar sx={{ mt: "auto", mb: "auto" }} sizes="small">
                    {m.login[0].toUpperCase()}
                  </Avatar>
                  <Paper sx={{ ml: 2, pt: 1, pb: 1, pl: 2, pr: 2 }}>
                    <Typography
                      sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 10 }}
                    >
                      {m?.first_name
                        ? m.first_name + " " + m.last_name
                        : m.name}{" "}
                      {dayjs(m.timestamp).format("H:mm")}
                    </Typography>
                    <Typography>{m.message}</Typography>
                  </Paper>
                </Box>
              )
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: "80%",
            mb: 3,
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <TextField
            autoFocus
            variant="standard"
            value={message}
            sx={{ width: "100%" }}
            onKeyDown={handleKeypress}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Box>
      <Paper
        sx={{
          width: "20%",
          borderLeft: "1px solid rgba(0, 0, 0, 0.6)",
          borderRadius: 0,
        }}
      >
        {currentChat ? (
          <Box
            sx={{
              display: { md: "flex", xs: "none" },
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ mt: 7, backgroundColor: "#8fa5f2" }}>I</Avatar>
            <Typography
              sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", mb: 2 }}
            >
              {currentChat.name}
            </Typography>
            <Typography sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
              <b>Ilość studentów:</b> {currentChat.students_count}
            </Typography>
            <Typography sx={{ color: "rgba(0, 0, 0, 0.6)", mb: 3 }}>
              <b>Nauczyciel:</b> {currentChat.owner}
            </Typography>
            <Button
              onClick={() => {
                navigate("/groups/" + currentChat.id);
              }}
              variant="outlined"
            >
              Strona grupy
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Paper>
    </Box>
  );
};

export default Chat;
