const express = require("express");
const router = express.Router();
const testController = require("../../controllers/testController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    testController.getTest
  );

//.delete(verifyRoles(rolesList.Student), groupController.deleteGroup);

router.route("/").post(verifyRoles(rolesList.Teacher), testController.addTest);

router
  .route("/:groupId")
  .post(verifyRoles(rolesList.Teacher), testController.addTestToGroup);

router
  .route("/:group")
  .get(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    testController.getGroupsTests
  );

router
  .route("/all/:group")
  .get(verifyRoles(rolesList.Teacher), testController.getAllTests);

router
  .route("/solve/:test")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    testController.getTestToSolve
  )
  .post(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    testController.addAnswerToTest
  );

router
  .route("/grade/:test")
  .get(verifyRoles(rolesList.Teacher), testController.getTestToGrade)
  .post(verifyRoles(rolesList.Teacher), testController.addGradeToTest);

router
  .route("/teacher/:login")
  .get(verifyRoles(rolesList.Teacher), testController.getTeachersTest);

module.exports = router;
