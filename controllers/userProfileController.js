const client = require("../config/database");

const getUserProfile = async (req, res) => {
  // if (!req?.params?.login)
  //   return res.status(400).json({ message: "User login required" });
  const login = req?.query?.login;
  //const login = req?.params?.login;
  const user = await client.query(
    `SELECT login, first_name, last_name, email, role FROM public."user" where login = \'${login}\' `
  );
  if (!user) {
    return res
      .status(204)
      .json({ message: `User login ${req.query.login} not found` });
  }
  res.json(user);
};

module.exports = {
  getUserProfile,
};
