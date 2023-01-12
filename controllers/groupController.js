const client = require("../config/database");

const getAllGroups = async (req, res) => {
  const login = req.query.login;

  const group = await client.query(
    `select "studentsGroup".students_id, "group".id, "group".name, Teacher.first_name, Teacher.last_name, Teacher.login, (select count(students_id) as students_count from public."studentsGroup" where group_id = "group".id)  
from public."studentsGroup" 
INNER JOIN public."user" as Student on "studentsGroup".students_id = Student.id 
INNER JOIN public."group" on "studentsGroup".group_id = "group".id
INNER JOIN public."user" as Teacher on "group".owner_id = Teacher.id
where Student.login = \'${login}\'
UNION
select Teacher.id, "group".id, "group".name, Teacher.first_name, Teacher.last_name, Teacher.login, (select count(students_id) as students_count from public."studentsGroup" where group_id = "group".id)  
from public."user" as Teacher
INNER JOIN public."group" on "group".owner_id = Teacher.id
where Teacher.login = \'${login}\'`
  );

  if (!group) {
    return res
      .status(204)
      .json({ message: `Groups for user ${login} not found` });
  }
  res.json(group);
};

const getGroup = async (req, res) => {
  if (!req?.query?.group)
    return res.status(400).json({ message: "Group name required" });
  const groupId = req?.query?.group;
  const groupName = await client.query(
    `select "group".name from public."group" 
    where id = \'${groupId}\'`
  );

  const group = await client.query(
    `select "studentsGroup".students_id, Student.first_name, Student.last_name, Student.login as studentLogin, Teacher.login
    from public."studentsGroup"
    INNER JOIN public."user" as Student ON "studentsGroup".students_id = Student.id 
    INNER JOIN public."group" on "studentsGroup".group_id = "group".id
    INNER JOIN public."user" as Teacher on "group".owner_id = Teacher.id
    where group_id = \'${groupId}\'`
  );

  const grades = await client.query(
    `select "user".id, "grades".score, "test".name from public."group" 
INNER JOIN public."studentsGroup" on "group".id = "studentsGroup".group_id
INNER JOIN public."user" on "studentsGroup".students_id = "user".id
LEFT JOIN public."answerToTest" on "answerToTest".student_id = "user".id
INNER JOIN public."testGroup" on "answerToTest"."groupTest_id" = "testGroup".id
INNER JOIN public."test" on "testGroup".test_id = "test".id
LEFT JOIN public."grades" on "answerToTest".id = "grades"."answerToTest_id"
where "group".id = \'${groupId}\' UNION
SELECT "gradesHomework".student_id,"gradesHomework".score, "homework".name from "gradesHomework"
INNER JOIN public."answerToHomework" on "gradesHomework".answer_id = "answerToHomework".id
INNER JOIN public."homework" on "homework".id = "answerToHomework".homework_id
where "homework"."groupId" = \'${groupId}\'`
  );

  if (!grades) {
    return res
      .status(204)
      .json({ message: `Group ${req.query.groupId} not found` });
  }

  if (!groupName) {
    return res
      .status(204)
      .json({ message: `Group of id ${req.query.group} not found` });
  }
  res.json({ group, groupName, grades });
};

module.exports = {
  getAllGroups,
  getGroup,
};
