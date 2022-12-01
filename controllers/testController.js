const client = require("../config/database");

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

module.exports = {
  getTest,
};
