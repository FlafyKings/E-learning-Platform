const client = require("../config/database");
const format = require("pg-format");

const getAllStudents = async (req, res) => {
  let groupId = req.params.groupId;

  const users = await client.query(
    `SELECT * from public."user" where role = 1000 and id not in (SELECT students_id from public."studentsGroup" where group_id = \'${groupId}\') `
  );
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users.rows);
};

const getAllUsers = async (req, res) => {
  const users = await client.query(
    `SELECT id, first_name, last_name, login from public."user"`
  );
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users.rows);
};

const addStudentToGroup = async (req, res) => {
  //Creating variables representing form values
  let groupId = req.body.gruopIdCurrent;
  let studentIds = req.body.values;
  var values = [];

  studentIds.map((row) => {
    var temp = [row.id, groupId];
    values.push(temp);
  });

  console.log(groupId);
  console.log(values);

  const result = await client.query(
    format(
      'INSERT INTO public."studentsGroup" (students_id, group_id) VALUES %L',
      values
    ),
    [],
    (err, response) => {
      console.log("Error: ", err);
      if (!err) {
        res.json({ message: "Success" });
      }
    }
  );
};

const deleteStudent = async (req, res) => {
  if (!req?.params?.studentId)
    return res.status(400).json({ message: "Students id required" });
  if (!req?.params?.groupId)
    return res.status(400).json({ message: "Groups id required" });

  const array = req?.params?.studentId;
  const studentsId = array.split(",");
  console.log(studentsId);
  const groupId = req?.params?.groupId;

  // const user = await client.query(
  //   format(`SELECT * FROM public."user" where id in %L `),
  //   studentsId
  // );
  // if (!user) {
  //   return res
  //     .status(204)
  //     .json({ message: `Students id ${req.body.studentsId} not found` });
  // }
  const result = await client.query(
    format(
      //`DELETE FROM public."studentsGroup" where students_id = \'${studentsId}\' and group_id = \'${groupId}\' returning *`
      `DELETE FROM public."studentsGroup" WHERE group_id = \'${groupId}\' and students_id in (%L) returning *`,
      studentsId
    ),
    [],
    (err, response) => {
      console.log("Error: ", err);
    }
  );
  res.json(result);
};

module.exports = {
  getAllStudents,
  addStudentToGroup,
  deleteStudent,
  getAllUsers,
};
