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
    `select "studentsGroup".students_id, Student.first_name, Student.last_name , Teacher.login
    from public."studentsGroup"
    INNER JOIN public."user" as Student ON "studentsGroup".students_id = Student.id 
    INNER JOIN public."group" on "studentsGroup".group_id = "group".id
    INNER JOIN public."user" as Teacher on "group".owner_id = Teacher.id
    where group_id = \'${groupId}\'`
  );

  if (!groupName) {
    return res
      .status(204)
      .json({ message: `Group of id ${req.query.group} not found` });
  }
  res.json({ group, groupName });
};

module.exports = {
  getAllGroups,
  getGroup,
};
