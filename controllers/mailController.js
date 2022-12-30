const client = require("../config/database");
const dayjs = require("dayjs");

const sendMail = async (req, res) => {
  if (!req?.body?.values.id) {
    return res.status(204).json({ message: `User id not found` });
  }

  const login = req.body.login;
  const title = req.body.title;
  const text = req.body.text;
  const id = req.body.values.id;
  const timestamp = dayjs();

  console.log(login, title, text, id, timestamp);

  const result = client.query(
    `INSERT INTO public."mail" (sender_id, receiver_id, text, title, timestamp) VALUES ((SELECT id from public."user" where login = \'${login}\'), \'${id}\', \'${text}\', \'${title}\', \'${timestamp}\')`
  );

  //   res.json({ messages, name });
};

const getMails = async (req, res) => {
  if (!req?.query?.login) {
    return res.status(204).json({ message: `Login not found` });
  }
  const login = req.query.login;

  const mail = await client.query(
    `SELECT "mail".id, "user".first_name, "user".last_name, "mail".sender_id,"mail".receiver_id,"mail".title, "mail".text, "mail".timestamp from public."mail" INNER JOIN public."user" on "user".id = "mail".receiver_id where "user".login = \'${login}\'`
  );

  const sentMail = await client.query(
    `SELECT "mail".id, Receiver.first_name, Receiver.last_name,"mail".sender_id,"mail".receiver_id,"mail".title, "mail".text, "mail".timestamp from public."mail" INNER JOIN public."user" as Sender on Sender.id = "mail".sender_id INNER JOIN public."user" as Receiver on "mail".receiver_id = Receiver.id  where Sender.login = \'${login}\'`
  );

  res.json({ mail, sentMail });
};

const getMail = async (req, res) => {
  if (!req?.query?.mailId) {
    return res.status(204).json({ message: `Mail not found` });
  }

  const mailId = req.query.mailId;
  console.log(req.query);

  const sentMail = await client.query(
    `SELECT Receiver.first_name as ReceiverFirstName, Receiver.last_name as ReceiverLastName, Sender.first_name as SenderFirstName, Sender.last_name as SenderLastName,  "mail".sender_id,"mail".receiver_id,"mail".title, "mail".text, "mail".timestamp from public."mail" INNER JOIN public."user" as Sender on Sender.id = "mail".sender_id INNER JOIN public."user" as Receiver on "mail".receiver_id = Receiver.id  where "mail".id = \'${mailId}\'`
  );
  res.json({ sentMail });
};

module.exports = {
  sendMail,
  getMails,
  getMail,
};
