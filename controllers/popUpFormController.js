const jwt = require("jsonwebtoken");
const client = require("../config/database");
const rolesList = require("../config/rolesList");

const handlePopUpForm = async (req, res) => {
  //Creating variables representing form values
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let role = req.body.role;
  let login = req.body.login;

  console.log(firstname, lastname, email, role);

  //Checking the validity of given values
  const re = new RegExp("^[^@]+@[^@]+.[^@]+$");
  const reNames = new RegExp("/^[A-Za-z]+$/");

  //Can create better regex to eliminate all the if statements - same goes to login and register pages

  if (re.test(email) == false) {
    return res
      .status(400)
      .json({ message: "E-mail jest nieprawidłowy", type: "email" });
  }
  if (email.length < 6) {
    return res
      .status(400)
      .json({ message: "Email jest za krótki", type: "email" });
  }
  if (firstname.length < 2) {
    return res
      .status(400)
      .json({ message: "Imie jest za krótkie", type: "firstname" });
  }
  if (lastname.length < 2) {
    return res
      .status(400)
      .json({ message: "Nazwisko jest za krótkie", type: "lastname" });
  }
  if (firstname.length > 20) {
    return res
      .status(400)
      .json({ message: "Imie jest za długie", type: "firstname" });
  }
  if (lastname.length > 30) {
    return res
      .status(400)
      .json({ message: "Nazwisko jest za długie", type: "lastname" });
  }

  console.log(login);

  try {
    const result = await client.query(
      `UPDATE public."user" SET first_name = \'${firstname}\', last_name = \'${lastname}\', email = \'${email}\', role = \'${rolesList[role]}\' WHERE login = \'${login}\'`
    );
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({
    message: "Aktualizacja poprawna",
  });
};

module.exports = { handlePopUpForm };
