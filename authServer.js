require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");

//CORS
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const router = express.Router();
const session = require("express-session");
const bcrypt = require("bcryptjs");
const app = express();
const path = require("path");

const dayjs = require("dayjs");

//CONTROLLERS
const authController = require("./controllers/authController");
const registerController = require("./controllers/registerController");
const refreshTokenController = require("./controllers/refreshTokenController");
const logoutController = require("./controllers/logoutController");
const popupformController = require("./controllers/popUpFormController");
const testController = require("./controllers/testController");

const jwt = require("jsonwebtoken");
const { auth } = require("express-openid-connect");
const { logger } = require("./middleware/logEvents");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const client = require("./config/database");

//PROXY SETTINGS
//Windows: "localhost:8080"
//Mac: "http://localhost:8080/"

client.connect();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

//Dashboard page GET request
app.get("/dashboard", async (req, res) => {});

app.post("/login", authController.handleLogin);
app.post("/register", registerController.handleRegister);
app.get("/refresh", refreshTokenController.handleRefreshToken);
app.get("/logout", logoutController.handleLogout);
app.post("/popupform", popupformController.handlePopUpForm);
app.post("/test/", testController.addTest);
app.post("/test/solve", testController.addAnswerToTest);
app.post("/test/grade", testController.addGradeToTest);

app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));
app.use("/students", require("./routes/api/students"));
app.use("/profile", require("./routes/api/profile"));
app.use("/group", require("./routes/api/group"));
app.use("/test", require("./routes/api/test"));
app.use("/grade", require("./routes/api/grade"));
app.use("/chat", require("./routes/api/message"));
app.use("/mail", require("./routes/api/mail"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

//SOCKETIO

const socketio = require("socket.io");
const { useEffect } = require("react");

const io = socketio(server);
const chat = io.of("/chat/");

chat.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/chat").sockets) {
    console.log("yoooooo", id, socket);
    users.push({
      userID: id,
      login: socket.login,
    });
  }
  socket.emit("users", users);

  socket.on("send message", (obj) => {
    const receiverId = obj.receiver_id;
    const text = obj.message;
    const timestamp = dayjs(obj.timestamp).add(1, "hour");
    const login = obj.login;
    console.log(obj.message);
    console.log(obj.login);
    console.log(obj.receiver_id);

    const result = client.query(
      `INSERT INTO public."message" (sender_id, receiver_id, text, timestamp) VALUES ((select "user".id from public."user" where login = \'${login}\'), \'${receiverId}\', \'${text}\', \'${timestamp}\')`
    );
    chat.emit("new message", obj);
  });
});

chat.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// chat.use((socket, next) => {
//   const login = socket.handshake.auth.login;
//   if (!login) {
//     return next(new Error("invalid username"));
//   }
//   socket.login = login;
//   next();
// });
