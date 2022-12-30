const express = require("express");
const router = express.Router();
const mailController = require("../../controllers/mailController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    mailController.sendMail
  );
router
  .route("/:login")
  .get(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    mailController.getMails
  );

router
  .route("/text/:mailId")
  .get(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    mailController.getMail
  );

module.exports = router;
