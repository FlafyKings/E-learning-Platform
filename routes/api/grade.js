const express = require("express");
const router = express.Router();
const gradeController = require("../../controllers/gradeController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/user/:userId")
  .get(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    gradeController.getUserGrades
  );

router
  .route("/group/:groupid")
  .get(verifyRoles(rolesList.Teacher), gradeController.getAllGroupGrades);

module.exports = router;
