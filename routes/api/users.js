const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    usersController.getAllUsers
  )
  .delete(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    usersController.deleteUser
  );

router.route("/:id").get(verifyRoles(rolesList.Admin), usersController.getUser);

module.exports = router;
