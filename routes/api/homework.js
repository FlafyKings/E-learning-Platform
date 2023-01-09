const express = require("express");
const router = express.Router();
const homeworkController = require("../../controllers/homeworkController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(verifyRoles(rolesList.Teacher), homeworkController.addHomework);

router
  .route("/:groupId")
  .get(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    homeworkController.getHomeWorkForGroupIncoming
  );

router
  .route("/solve/:id")
  .get(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    homeworkController.getHomework
  );

router
  .route("/all/:group")
  .get(verifyRoles(rolesList.Teacher), homeworkController.getAllHomework);

router
  .route("/grade/:id")
  .get(verifyRoles(rolesList.Teacher), homeworkController.getAnswerHomework);

router
  .route("/file/:id")
  .get(
    verifyRoles(rolesList.Teacher),
    homeworkController.getFileAnswerHomework
  );

module.exports = router;
