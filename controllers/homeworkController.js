const client = require("../config/database");
const format = require("pg-format");
const dayjs = require("dayjs");
const path = require("path");
const fs = require("fs");

const addHomework = async (req, res) => {
  console.log(req.body);
  if (!req.body.groupIdCurrent) {
    return res.status(400).json({ message: "Group id required" });
  }

  const login = req.body.login;
  const groupId = req.body.groupIdCurrent;
  const title = req.body.title;
  const text = req.body.text;
  var date = req.body.testDate;

  date = dayjs(date).add(2, "hour");

  //   console.log(testId, groupId, date);

  client.query(
    `INSERT INTO public."homework" (name, "groupId", deadline, owner_id, question ) values (\'${title}\', \'${groupId}\', \'${date}\', (select id from public."user" where login = \'${login}\'), \'${text}\') RETURNING *`,
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      }
      console.log(response);

      // testId = response.rows[0].id;
      // console.log("test", testId);
    }
  );

  res.json({ message: "Inesrting successfull" });
};

const getHomeWorkForGroupIncoming = async (req, res) => {
  console.log(req.query);

  if (!req.query.groupId) {
    return res.status(400).json({ message: "Group id required" });
  }

  const groupId = req.query.groupId;
  const today = dayjs();

  const homework = await client.query(
    `SELECT * from public."homework" where "groupId" = \'${groupId}\' and deadline > \'${today}\'`
  );

  res.json({ homework });
};

const getHomework = async (req, res) => {
  if (!req.query.homeworkId) {
    return res.status(400).json({ message: "Group id required" });
  }
  const homeworkId = req.query.homeworkId;

  const homework = await client.query(
    `SELECT * from public."homework" where id = \'${homeworkId}\'`
  );
  res.json({ homework });
};

const addAnswerHomework = async (req, res) => {
  const description = req.body.description;
  const login = req.body.login;
  const homeworkId = req.body.homeworkIdCurrent;
  const today = dayjs();
  var answerId = 0;
  console.log(description, login, homeworkId);

  client.query(
    `INSERT INTO public."answerToHomework" (student_id, description, homework_id, timestamp ) values ((select id from public."user" where login = \'${login}\'), \'${description}\', \'${homeworkId}\', \'${today}\') RETURNING id`,
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      }
      answerId = response.rows[0].id;
      if (req.files != null) {
        const newpath = __dirname + "/files/";
        const file = req.files.file;
        const filename = answerId + "-" + req.files.file.name;
        file.mv(`${newpath}${filename}`, (err) => {
          if (err) {
            console.log(err);
            res.status(500).send({ message: "File upload failed", code: 200 });
          } else {
            res.status(200).send({ message: "File Uploaded", code: 200 });
          }
        });
      }
    }
  );
  res.json({ message: "Dodano odpowiedź!" });
};

const getAllHomework = async (req, res) => {
  if (!req?.query?.groupId) {
    return res.status(400).json({ message: "Group id required" });
  }
  const groupId = req.query.groupId;

  //All homework in a group

  //All ungraded homework attempts

  //All homework attempts in a group

  const homeworks = await client.query(`
SELECT "homework".id ,"homework".name from public."homework" 
where "homework"."groupId" = \'${groupId}\'`);

  const ungradedHomework = await client.query(`
SELECT testGroup.id as testid, testGroup.name, "user".first_name, "user".last_name, "answerToHomework".id as answerid
from public."homework" as testGroup
INNER JOIN public."answerToHomework" on "answerToHomework"."homework_id" = testGroup.id
INNER JOIN public."user" on "answerToHomework".student_id = "user".id
where testGroup."groupId" = \'${groupId}\' and "answerToHomework".id not in (select "gradesHomework"."answer_id" from public."gradesHomework")`);

  const allAttemptsHomework =
    await client.query(`SELECT testGroup.id as testid, testGroup.name, "user".first_name, "user".last_name, "answerToHomework".id as answerid, "gradesHomework".score
from public."homework" as testGroup
INNER JOIN public."answerToHomework" on "answerToHomework"."homework_id" = testGroup.id
INNER JOIN public."user" on "answerToHomework".student_id = "user".id
INNER JOIN public."gradesHomework" on "answerToHomework".id = "gradesHomework"."answer_id"
where testGroup."groupId" = \'${groupId}\'`);

  if (!homeworks) return res.status(204).json({ message: "No tests found" });

  res.json({ homeworks, ungradedHomework, allAttemptsHomework });
};

const getAnswerHomework = async (req, res) => {
  if (!req.query.homeworkId) {
    return res.status(400).json({ message: "Homework id required" });
  }

  const homeworkId = req.query.homeworkId;

  const homework = await client.query(
    `SELECT * from public."answerToHomework" INNER JOIN public."homework" on "homework".id = "answerToHomework".homework_id INNER JOIN public."user" on "user".id = "answerToHomework".student_id where "answerToHomework".id = \'${homeworkId}\'`
  );

  res.json({ homework });
};

const getFileAnswerHomework = async (req, res) => {
  if (!req.query.homeworkId) {
    return res.status(400).json({ message: "Homework id required" });
  }

  const homeworkId = req.query.homeworkId;

  const homework = await client.query(
    `SELECT * from public."answerToHomework" INNER JOIN public."homework" on "homework".id = "answerToHomework".homework_id INNER JOIN public."user" on "user".id = "answerToHomework".student_id where "answerToHomework".id = \'${homeworkId}\'`
  );

  fs.readdir(__dirname + "/files/", (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const matchingFiles = files.filter(
      (file) => file.split("-")[0] === homeworkId
    );
    if (matchingFiles.length > 0) {
      res.sendFile(path.join(__dirname + "/files/", matchingFiles[0]));
    } else {
      console.log("No file");
    }
  });
};

const addGradeToHomework = async (req, res) => {
  if (!req.body.homeworkIdCurrent) {
    return res.status(400).json({ message: "Homework id required" });
  }

  var score = req?.body?.scorePercentage;
  score = Math.floor(score);
  const login = req?.body?.login;
  const homeworkId = req?.body?.homeworkIdCurrent;

  client.query(
    `INSERT INTO public."gradesHomework" (score, answer_id, student_id) values (\'${score}\', \'${homeworkId}\', (select "answerToHomework".student_id from public."answerToHomework" where "answerToHomework".id = \'${homeworkId}\')) RETURNING *`,
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      }
      res.json({ message: "Dodano zadanie!" });
    }
  );
};

module.exports = {
  addHomework,
  getHomeWorkForGroupIncoming,
  getHomework,
  addAnswerHomework,
  getAnswerHomework,
  getFileAnswerHomework,
  addGradeToHomework,
  getAllHomework,
};
