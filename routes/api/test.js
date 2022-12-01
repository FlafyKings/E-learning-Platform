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

router
  .route("/:test")
  .get(
    verifyRoles(rolesList.Student, rolesList.Teacher),
    testController.getTest
  );

module.exports = router;
