const express = require("express");
const router = express.Router();
const groupController = require("../../controllers/groupController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    groupController.getAllGroups
  );
//.delete(verifyRoles(rolesList.Student), groupController.deleteGroup);

router
  .route("/:group")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    groupController.getGroup
  );

module.exports = router;
