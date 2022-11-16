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

//CONTROLLERS
const authController = require("./controllers/authController");
const registerController = require("./controllers/registerController");

const jwt = require("jsonwebtoken");
const { auth } = require("express-openid-connect");
const { logger } = require("./middleware/logEvents");
const client = require("./database");

//PROXY SETTINGS
//Windows: "localhost:8080"
//Mac: "http://localhost:8080/"

client.connect();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid" });
    }
    req.user = user;
    next();
  });
}

app.post("/login", authController.handleLogin);
app.post("/register", registerController.handleRegister);

//Dashboard page GET request
app.get("/dashboard", authenticateToken, async (req, res) => {
  //Creating a query for getting all the info needed for dashboard
  try {
    const result = await client.query(
      `SELECT login FROM public."user" WHERE login = '${req.user.login}'`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
