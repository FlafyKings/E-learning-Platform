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

//CONTROLLERS
const authController = require("./controllers/authController");
const registerController = require("./controllers/registerController");
const refreshTokenController = require("./controllers/refreshTokenController");
const logoutController = require("./controllers/logoutController");
const popupformController = require("./controllers/popUpFormController");

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

app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));
app.use("/profile", require("./routes/api/profile"));
app.use("/group", require("./routes/api/group"));
app.use("/test", require("./routes/api/test"));

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

app.listen(PORT, console.log(`Server started on port ${PORT}`));
