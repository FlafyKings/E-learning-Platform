const client = require("../config/database");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;
  // Is refreshToken in db?
  const foundUser = await client.query(
    `SELECT * FROM public."user" where refresh_token = \'${refreshToken}\' `
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  // Delete refreshToken in db
  const updateRefreshToken = await client.query(
    `UPDATE public."user" SET refresh_token = \'\' where refresh_token = \'${refreshToken}\' `
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};
module.exports = { handleLogout };
