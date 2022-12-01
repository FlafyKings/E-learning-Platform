const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/userProfileController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    profileController.getUserProfile
  );

router
  .route("/:login")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    profileController.getUserProfile
  );

module.exports = router;
