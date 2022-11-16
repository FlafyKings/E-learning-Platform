const jwt = require("jsonwebtoken");
const client = require("../config/database");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await client.query(
    `SELECT * FROM public."user" WHERE refresh_token = \'${refreshToken}\'`
  );
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.rows[0].login !== decoded.login)
      return res.sendStatus(403);
    const roles = foundUser.rows[0].role;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          login: decoded.login,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    res.json({ roles, accessToken });
  });
};

module.exports = { handleRefreshToken };
