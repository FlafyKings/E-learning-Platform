const client = require("../config/database");
const format = require("pg-format");

const getTest = async (req, res) => {
  if (!req?.query?.test)
    return res.status(400).json({ message: "Test id required" });
  const testId = req?.query?.test;
  const testName = await client.query(
    `select "test".name from public."test" 
    where id = \'${testId}\'`
  );
  const test = await client.query(
    `select "questionTest".test_id, Question.description, Question.answer_1, Question.answer_2, Question.answer_3, Question.answer_4 
    from public."questionTest"
    INNER JOIN public."question" as Question ON "questionTest".question_id = Question.id 
    where test_id = \'${testId}\'`
  );

  if (!testName) {
    return res
      .status(204)
      .json({ message: `Test of id ${req.query.test} not found` });
  }
  res.json({ test, testName });
};

const getGroupsTests = async (req, res) => {
  if (!req?.query?.groupId) {
    return res.status(400).json({ message: "Group id required" });
  }
  const groupId = req.query.groupId;

  const tests =
    await client.query(`SELECT test.name, test.time, testGroup.date from public."testGroup" as testGroup
      INNER JOIN public."test" on testGroup.test_id = "test".id
      where group_id = \'${groupId}\'`);
  if (!tests) return res.status(204).json({ message: "No tests found" });
  res.json(tests.rows);
};

const addTest = async (req, res) => {
  var values = [];
  for (let i = 0; i < req.body.inputlength; i++) {
    let question = req.body.inputs["question" + i];
    let answer1 = req.body.inputs["answer1" + i];
    let answer2 = req.body.inputs["answer2" + i];
    let answer3 = req.body.inputs["answer3" + i];
    let answer4 = req.body.inputs["answer4" + i];
    var row = [question, answer1, answer2, answer3, answer4];

    for (let index = 0; index < row.length; index++) {
      if (row[index] === "") {
        row[index] = null;
      }
    }

    values.push(row);
  }
  const login = req.body.login;
  const title = req.body.title;
  const testTime = req.body.testTime;
  console.log(req.body);

  const user = await client.query(
    `SELECT id FROM public."user" where login = \'${login}\' `
  );

  const userId = user.rows[0].id;
  let testId = "";
  let questionIds = [];
  client.query(
    `INSERT INTO public.\"test\" (name, owner_id, time) VALUES ('${title}', '${userId}','${testTime}') RETURNING id`,
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      }
      testId = response.rows[0].id;

      console.log("test", testId);
    }
  );

  client.query(
    format(
      'INSERT INTO public."question" (description, answer_1, answer_2,answer_3,answer_4) VALUES %L RETURNING id',
      values
    ),
    [],
    (err, response) => {
      console.log("Error: ", err);
      response.rows.map((x) => {
        questionIds.push([testId, x.id]);
      });
      console.log("questions", questionIds);
      client.query(
        format(
          'INSERT INTO public."questionTest" (test_id, question_id) VALUES %L',
          questionIds
        )
      );
    }
  );

  res.json({ siems: "siema" });
};

module.exports = {
  getTest,
  addTest,
  getGroupsTests,
};
