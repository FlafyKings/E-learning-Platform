require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const session = require("express-session");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const { auth } = require("express-openid-connect");

//PROXY SETTINGS
//Windows: "localhost:8080"
//Mac: "http://localhost:8080/"

//DATABASE
const { Client } = require("pg");
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  // Change using:
  // SELECT *
  // FROM pg_settings
  // WHERE name = 'port';
  password: "postgres",
  database: "LepszyUPEL",
});

client.connect();

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

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// //Login Page POST Request
app.post("/login", async (req, res) => {
  //Creating variables representing form values
  let login = req.body.login;
  let password = req.body.password;

  //Creating a user object for a token
  const user = { login: login };

  //Checking the validity of given values
  const re = new RegExp("[a-z]{3,}.[a-z]{2,}");

  if (re.test(login) == false) {
    return res
      .status(400)
      .json({ message: "Login is not valid", type: "Login" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password is too short", type: "Password" });
  }
  if (password.length > 30) {
    return res
      .status(400)
      .json({ message: "Password is too long", type: "Password" });
  }

  try {
    const result = await client.query(
      `SELECT * FROM public."user" WHERE login = \'${login}\'`
    );
    console.log(result.rows);
    if (result.rows.length == 0) {
      return res
        .status(400)
        .json({ message: "User doesnt exist", type: "Login" });
    } else {
      bcrypt.compare(password, result.rows[0].password).then((response) => {
        if (response) {
          //const accessToken = generateAccessToken(user)
          //const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
          const accessToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

          res.status(200).json({
            message: "Login successfull",
            redirect: "/dashboard",
            accessToken: accessToken,
            //refreshToken: refreshToken
          });
        } else {
          res.status(400).json({
            message: "Password is incorrect",
            type: "Password",
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//Register Page POST Request
app.post("/register", async (req, res) => {
  //Creating variables representing form values
  let login = req.body.login;
  let password = req.body.password;
  let passwordConfirm = req.body.passwordConfirm;

  //Creating a user object for a token
  const user = { login: login };

  //Checking the validity of given values
  const re = new RegExp("[a-z]{3,}.[a-z]{2,}");

  if (re.test(login) == false) {
    return res
      .status(400)
      .json({ message: "Login is not valid", type: "Login" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password is too short", type: "Password" });
  }
  if (password.length > 30) {
    return res
      .status(400)
      .json({ message: "Password is too long", type: "Password" });
  }

  if (password != passwordConfirm) {
    return res
      .status(400)
      .json({ message: "Passwords dont match", type: "PasswordConfirm" });
  }

  try {
    const result = await client.query(
      `SELECT * FROM public."user" WHERE login = \'${login}\'`
    );
    console.log(result.rows);
    if (result.rows.length != 0) {
      return res
        .status(400)
        .json({ message: "User already exists", type: "Login" });
    }
  } catch (err) {
    console.log(err);
  }

  bcrypt.hash(password, 10).then((hash) => {
    //Making an insert query to the database with given values
    client.query(
      `INSERT INTO public.\"user\" (login, password) VALUES ('${login}', '${hash}')`,
      (err, result) => {
        if (err) {
          console.log(err.message);
          res.status(401).json({
            message: "User not successfully created",
            error: err.message,
          });
        } else if (result) {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          res.status(200).json({
            message: "User successfully created",
            redirect: "/dashboard",
            accessToken: accessToken,
          });
        }
      }
    );
  });
});

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
