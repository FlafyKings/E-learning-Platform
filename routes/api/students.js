const express = require("express");
const router = express.Router();
const studentsController = require("../../controllers/studentsController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(verifyRoles(rolesList.Teacher), studentsController.addStudentToGroup);

router
  .route("/:groupId")
  .get(verifyRoles(rolesList.Teacher), studentsController.getAllStudents);

router
  .route("/:studentId/:groupId")
  .delete(verifyRoles(rolesList.Teacher), studentsController.deleteStudent);

module.exports = router;
