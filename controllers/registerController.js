const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../config/database");

//Register Page POST Request
const handleRegister = async (req, res) => {
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
      .json({ message: "Login jest nieprawidłowy", type: "Login" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Hasło jest za krótkie", type: "Password" });
  }
  if (password.length > 30) {
    return res
      .status(400)
      .json({ message: "Hasło jest za długie", type: "Password" });
  }

  if (password != passwordConfirm) {
    return res
      .status(400)
      .json({ message: "Hasła nie są identyczne", type: "PasswordConfirm" });
  }

  try {
    const result = await client.query(
      `SELECT * FROM public."user" WHERE login = \'${login}\'`
    );
    console.log(result.rows);
    if (result.rows.length != 0) {
      return res
        .status(400)
        .json({ message: "Użytkownik już istnieje", type: "Login" });
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
            message: "Utworzenie użytkownika nie powiodło się",
            error: err.message,
          });
        } else if (result) {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          res.status(200).json({
            message: "Utworzenie użytkownika powiodło się",
            redirect: "/dashboard",
            accessToken: accessToken,
            roles: [1000],
          });
        }
      }
    );
  });
};

module.exports = { handleRegister };
