const express = require("express");
const router = express.Router();
const messageController = require("../../controllers/messageController");
const rolesList = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/:groupId")
  .get(
    verifyRoles(rolesList.Teacher, rolesList.Student),
    messageController.getGroupMessages
  );

module.exports = router;
