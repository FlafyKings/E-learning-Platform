const client = require("../config/database");
const format = require("pg-format");

const getAllUsers = async (req, res) => {
  const users = await client.query(`SELECT * FROM public."user" `);
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users.rows);
};

const getAllTeachers = async (req, res) => {
  const users = await client.query(
    `SELECT id, login, first_name, last_name FROM public."user" where role = '2000' `
  );
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users.rows);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.login)
    return res.status(400).json({ message: "User login required" });
  const login = req?.body?.login;
  const user = await client.query(
    `SELECT * FROM public."user" where login = \'${login}\' `
  );
  if (!user) {
    return res
      .status(204)
      .json({ message: `User login ${req.body.login} not found` });
  }
  //const result = await user.deleteOne({ _id: req.body.id });
  const result = await client.query(
    `DELETE FROM public."user" where login = \'${login}\' returning *`
  );
  //DELETING FROM DATABASE
  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.login)
    return res.status(400).json({ message: "User login required" });
  const login = req?.params?.login;
  const user = await client.query(
    `SELECT * FROM public."user" where login = \'${login}\' `
  );
  if (!user) {
    return res
      .status(204)
      .json({ message: `User login ${req.params.login} not found` });
  }
  res.json(user.rows[0]);
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
  getAllTeachers,
};
