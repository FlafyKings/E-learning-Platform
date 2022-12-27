const client = require("../config/database");
const format = require("pg-format");
const dayjs = require("dayjs");

const getUserGrades = async (req, res) => {
  const login = req.query.login;

  const grades = await client.query(
    `select "grades".score, "testGroup".date, "test".name as testname, "group".name as groupname from "public".grades
INNER JOIN public."answerToTest" on grades."answerToTest_id" = "answerToTest".id
INNER JOIN public."testGroup" on "answerToTest"."groupTest_id" = "testGroup".id
INNER JOIN public."group" on "testGroup".group_id = "group".id
INNER JOIN public."test" on "testGroup".test_id = "test".id
INNER JOIN public."user" on "answerToTest".student_id = "user".id
where "user".login = \'${login}\'`
  );

  const groups = await client.query(
    `select "group".name
from public."studentsGroup" 
INNER JOIN public."user" as Student on "studentsGroup".students_id = Student.id 
INNER JOIN public."group" on "studentsGroup".group_id = "group".id
where Student.login = \'${login}\'`
  );

  if (!grades) {
    return res
      .status(204)
      .json({ message: `Login ${req.query.login} not found` });
  }
  res.json({ groups, grades });
};

const getAllGroupGrades = async (req, res) => {
  const groupId = req.query.groupId;

  const grades = await client.query(
    `select "user".id, "grades".score from public."group" 
INNER JOIN public."studentsGroup" on "group".id = "studentsGroup".group_id
INNER JOIN public."user" on "studentsGroup".students_id = "user".id
LEFT JOIN public."answerToTest" on "answerToTest".student_id = "user".id
LEFT JOIN public."grades" on "answerToTest".id = "grades"."answerToTest_id"
where "group".id = \'${groupId}\'`
  );

  if (!grades) {
    return res
      .status(204)
      .json({ message: `Group ${req.query.groupId} not found` });
  }
  res.json({ grades });
};

module.exports = {
  getUserGrades,
  getAllGroupGrades,
};
