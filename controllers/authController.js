const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../config/database");

const handleLogin = async (req, res) => {
  //Creating variables representing form values
  let login = req.body.login;
  let password = req.body.password;

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

  try {
    const result = await client.query(
      `SELECT * FROM public."user" WHERE login = \'${login}\'`
    );
    console.log(result.rows);
    // console.log(result.rows[0].role);
    if (result.rows.length == 0) {
      return res
        .status(400)
        .json({ message: "Użytkownik nie istnieje", type: "Login" });
    } else {
      bcrypt.compare(password, result.rows[0].password).then((response) => {
        if (response) {
          const roles = [result.rows[0].role];
          const accessToken = jwt.sign(
            {
              UserInfo: {
                login: login,
                roles: roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10s" }
          );

          const refreshToken = jwt.sign(
            { login: login },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          const updateRefreshToken = client.query(
            `UPDATE public."user" SET refresh_token = \'${refreshToken}\' WHERE login = \'${login}\'`
          );

          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });

          res.status(200).json({
            message: "Login successfull",
            accessToken: accessToken,
            roles: roles,
          });
        } else {
          res.status(400).json({
            message: "Hasło jest niepoprawne",
            type: "Password",
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handleLogin };
