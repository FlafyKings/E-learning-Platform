const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(
      "--------------------------------------------------------------------",
      req.user.UserInfo.roles
    );
    if (!req?.user.UserInfo.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const result = req.user.UserInfo.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    console.log("ROLES ARRAY:", rolesArray);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
