const client = require("../config/database");

const getGroupMessages = async (req, res) => {
  console.log(req.query);
  if (!req?.query?.groupId) {
    return res
      .status(204)
      .json({ message: `Group ${req.query.groupId} not found` });
  }

  const groupId = req.query.groupId;
  const login = req.query.login;

  console.log("groupa", groupId);
  const messages = await client.query(
    `select "message".sender_id, "message".receiver_id, "message".text, "message".timestamp, "user".login, "user".first_name, "user".last_name from public."message"
INNER JOIN public."user" on "user".id = "message".sender_id
where "message".receiver_id = \'${groupId}\'`
  );

  const name = await client.query(
    `SELECT "user".first_name, "user".last_name from public."user" where login = \'${login}\'`
  );

  console.log(messages.rows);
  if (!messages) {
    return res.status(204).json({ message: `Messages not found` });
  }

  res.json({ messages, name });
};
module.exports = {
  getGroupMessages,
};
