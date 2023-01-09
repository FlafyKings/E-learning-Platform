const client = require("../config/database");
const format = require("pg-format");
const dayjs = require("dayjs");

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

const getTeachersTest = async (req, res) => {
  if (!req?.params?.login) {
    return res.status(400).json({ message: "Login required" });
  }
  const login = req.params.login;
  const tests = await client.query(`SELECT test.name, test.id from public."test"
      INNER JOIN public."user" on test.owner_id = "user".id
      where "user".login = \'${login}\'`);
  if (!tests) return res.status(204).json({ message: "No tests found" });
  res.json(tests.rows);
};

const addAnswerToTest = async (req, res) => {
  const testId = req.body.testId;
  const login = req.body.login;
  const answerArray = req.body.answerArray;
  const testTemplateId = req.body.testTemplateId;
  const testLength = req.body.testLength;

  console.log("test lenght", testLength);
  var answerId;

  client.query(
    `INSERT INTO public."answerToTest" ("groupTest_id", student_id) values (\'${testId}\', (SELECT "user".id from public."user" where "user".login = \'${login}\')) RETURNING id`,
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      }
      answerId = response.rows[0].id;
      console.log(answerId);
      answerArray.sort((a, b) => {
        a.id > b.id;
      });
      const values = [];

      console.log(answerArray);

      for (let i = 0; i < testLength; i++) {
        let sumOfClosed = "1234";
        let text = null;
        answerArray.map((row) => {
          if (row.id[0] == i) {
            sumOfClosed = sumOfClosed.replace(
              (parseInt(row.id[1]) + 1).toString(),
              "5"
            );
          }
          if (row.id == "open-" + i) {
            text = row.text;
          }
        });
        if (text == null) {
          var close_answer = sumOfClosed;
        } else {
          var close_answer = null;
        }
        var open_answer = text;
        values.push([close_answer, open_answer, answerId]);
      }
      console.log(values);

      client.query(
        format(
          'INSERT INTO public."answerToQuestion" (close_answer, open_answer, "testAnswer_id") VALUES %L RETURNING id',
          values
        ),
        [],
        (err, response) => {
          console.log("Error: ", err);
        }
      );
    }
  );

  res.json({ message: "Answer saved successfully" });
};

const addGradeToTest = async (req, res) => {
  const correct = req.body.correct;
  const answers = req.body.answers;
  const score = req.body.studentScore;
  const testId = req.body.testId;

  var correctString = "";
  correct.map((row) => {
    correctString += row;
  });

  var answersString = "";
  answers.map((row) => {
    answersString += row;
  });

  console.log(correctString, answersString, score, testId);

  client.query(
    `INSERT INTO public."grades" (score, "answerToTest_id", answers, correct ) values (\'${score}\', \'${testId}\', \'${answers}\', \'${correct}\') RETURNING *`,
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      }
      console.log("res", response);
    }
  );

  res.json({ message: "Grade saved successfully" });
};

const getTestToGrade = async (req, res) => {
  if (!req?.query?.test)
    return res.status(400).json({ message: "Test id required" });
  const testId = req?.query?.test;

  const testDetails = await client.query(
    `select "user".first_name, "user".last_name, "test".name
from public."answerToTest" as answer
INNER JOIN public."user" on student_id = public."user".id 
INNER JOIN public."testGroup" on answer."groupTest_id" = "testGroup".id
INNER JOIN public."test" on "testGroup".test_id = "test".id
where answer.id = \'${testId}\'`
  );

  const test = await client.query(
    `select "questionTest".test_id, Question.description, Question.answer_1, Question.answer_2, Question.answer_3, Question.answer_4, correct 
    from public."questionTest"
    INNER JOIN public."question" as Question ON "questionTest".question_id = Question.id 
	INNER JOIN public."testGroup" ON "testGroup".test_id = "questionTest".test_id
	INNER JOIN public."answerToTest" on "answerToTest"."groupTest_id" = "testGroup".id
    where "answerToTest".id = \'${testId}\'`
  );

  const answers = await client.query(
    `select answer.close_answer, answer.open_answer from public."answerToQuestion" as answer where answer."testAnswer_id" = \'${testId}\'`
  );

  if (!testDetails) {
    return res
      .status(204)
      .json({ message: `Test of id ${req.query.test} not found` });
  }
  res.json({ test, testDetails, answers });
};

const addTestToGroup = async (req, res) => {
  console.log(req.body);
  if (!req.body.testId) {
    return res.status(400).json({ message: "Testid required" });
  }
  if (!req.body.groupId) {
    return res.status(400).json({ message: "Group id required" });
  }
  const testId = req.body.testId;
  const groupId = req.body.groupId;
  var date = req.body.testDate;
  date = dayjs(date).add(1, "hour").set("second", 0);

  console.log(testId, groupId, date);

  client.query(
    `INSERT INTO public."testGroup" (test_id, group_id, date ) values (\'${testId.id}\', \'${groupId.current}\', \'${date}\') RETURNING *`,
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

const getGroupsTests = async (req, res) => {
  if (!req?.query?.groupId) {
    return res.status(400).json({ message: "Group id required" });
  }
  const groupId = req.query.groupId;
  const today = dayjs();

  const tests =
    await client.query(`SELECT testGroup.id, test.name, test.time, testGroup.date from public."testGroup" as testGroup
      INNER JOIN public."test" on testGroup.test_id = "test".id
      where group_id = \'${groupId}\' and date > \'${today}\'`);

  var testsSorted = tests.rows;

  testsSorted.sort(function (a, b) {
    return a.date - b.date;
  });
  console.log(testsSorted);

  if (!tests) return res.status(204).json({ message: "No tests found" });
  res.json(testsSorted);
};

const getAllTests = async (req, res) => {
  if (!req?.query?.groupId) {
    return res.status(400).json({ message: "Group id required" });
  }
  const groupId = req.query.groupId;

  //All tests in a group

  //All ungraded test attempts

  //All test attempts in a group

  const tests =
    await client.query(`SELECT "testGroup".id, "test".name from public."testGroup" 
INNER JOIN public."test" on "testGroup".test_id = "test".id
where "testGroup".group_id = \'${groupId}\' UNION 
SELECT "homework".id ,"homework".name from public."homework" 
where "homework"."groupId" = \'${groupId}\'`);

  const ungraded =
    await client.query(`SELECT testGroup.id as testid, test.name, "user".first_name, "user".last_name, "answerToTest".id as answerid
from public."testGroup" as testGroup
INNER JOIN public."test" on testGroup.test_id = "test".id
INNER JOIN public."answerToTest" on "answerToTest"."groupTest_id" = testGroup.id
INNER JOIN public."user" on "answerToTest".student_id = "user".id
where group_id = \'${groupId}\' and "answerToTest".id not in (select grades."answerToTest_id" from grades) UNION
SELECT testGroup.id as testid, testGroup.name, "user".first_name, "user".last_name, "answerToHomework".id as answerid
from public."homework" as testGroup
INNER JOIN public."answerToHomework" on "answerToHomework"."homework_id" = testGroup.id
INNER JOIN public."user" on "answerToHomework".student_id = "user".id
where testGroup."groupId" = \'${groupId}\' and "answerToHomework".id not in (select "gradesHomework"."answer_id" from public."gradesHomework")`);

  const allAttempts =
    await client.query(`SELECT testGroup.id as testid, test.name, "user".first_name, "user".last_name, "answerToTest".id as answerid, "grades".score
from public."testGroup" as testGroup
INNER JOIN public."test" on testGroup.test_id = "test".id
INNER JOIN public."answerToTest" on "answerToTest"."groupTest_id" = testGroup.id
INNER JOIN public."user" on "answerToTest".student_id = "user".id
INNER JOIN public."grades" on "answerToTest".id = "grades"."answerToTest_id"
where group_id = \'${groupId}\' UNION SELECT testGroup.id as testid, testGroup.name, "user".first_name, "user".last_name, "answerToHomework".id as answerid, "gradesHomework".score
from public."homework" as testGroup
INNER JOIN public."answerToHomework" on "answerToHomework"."homework_id" = testGroup.id
INNER JOIN public."user" on "answerToHomework".student_id = "user".id
INNER JOIN public."gradesHomework" on "answerToHomework".id = "gradesHomework"."answer_id"
where testGroup."groupId" = \'${groupId}\'`);

  // var testsSorted = tests.rows;

  // testsSorted.sort(function (a, b) {
  //   return b.date - a.date;
  // });

  if (!tests) return res.status(204).json({ message: "No tests found" });

  res.json({ tests, ungraded, allAttempts });
};

const getTestToSolve = async (req, res) => {
  if (!req?.query?.test)
    return res.status(400).json({ message: "Test id required" });

  const testId = req?.query?.test;
  const login = req?.query?.login;

  const answer = await client.query(`select "user".login from "answerToTest"
INNER JOIN public."user" on "answerToTest".student_id = "user".id
where "user".login = \'${login}\' and "answerToTest"."groupTest_id" = ${testId}`);

  console.log(answer.rows);

  if (answer.rows.length != 0) {
    return res
      .status(400)
      .json({ message: "Test został już przez Ciebie rozwiązany" });
  }

  const testDetails = await client.query(
    `select "test".id, "test".name, "test".time, "user".first_name, "user".last_name, "testGroup".date
from public."test" 
INNER JOIN public."user" on owner_id = public."user".id 
INNER JOIN public."testGroup" on test.id = "testGroup".test_id 
where "testGroup".id = \'${testId}\'`
  );

  if (dayjs() - dayjs(testDetails.rows[0].date) < 0) {
    return res.status(400).json({ message: "Test jeszcze się nie rozpoczął" });
  }

  const time = testDetails.rows[0].time;

  if (
    dayjs() -
      dayjs(testDetails.rows[0].date)
        .add(time % 60, "minute")
        .add(Math.floor(time / 60), "hour") >
    0
  ) {
    return res.status(400).json({ message: "Test już się zakończył" });
  }

  const test = await client.query(
    `select "questionTest".test_id, Question.description, Question.answer_1, Question.answer_2, Question.answer_3, Question.answer_4 
    from public."questionTest"
    INNER JOIN public."question" as Question ON "questionTest".question_id = Question.id 
	INNER JOIN public."testGroup" ON "testGroup".test_id = "questionTest".test_id
    where "testGroup".id = \'${testId}\'`
  );

  if (!testDetails) {
    return res
      .status(204)
      .json({ message: `Test of id ${req.query.test} not found` });
  }
  res.json({ test, testDetails });
};

const addTest = async (req, res) => {
  var values = [];
  for (let i = 0; i < req.body.inputlength; i++) {
    let question = req.body.inputs["question" + i];
    let answer1 = req.body.inputs["answer1" + i];
    let answer2 = req.body.inputs["answer2" + i];
    let answer3 = req.body.inputs["answer3" + i];
    let answer4 = req.body.inputs["answer4" + i];

    let correct1 = req.body.inputs["correct1" + i];
    let correct2 = req.body.inputs["correct2" + i];
    let correct3 = req.body.inputs["correct3" + i];
    let correct4 = req.body.inputs["correct4" + i];

    //PLACE FOR CORRECT
    let sumOfClosed = "1234";

    if (correct1 == true && answer1 !== "") {
      sumOfClosed = sumOfClosed.replace("1", "5");
    }
    if (correct2 == true && answer2 !== "") {
      sumOfClosed = sumOfClosed.replace("2", "5");
    }
    if (correct3 == true && answer3 !== "") {
      sumOfClosed = sumOfClosed.replace("3", "5");
    }
    if (correct4 == true && answer4 !== "") {
      sumOfClosed = sumOfClosed.replace("4", "5");
    }

    var correct = sumOfClosed;

    var row = [question, answer1, answer2, answer3, answer4, correct];

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
      'INSERT INTO public."question" (description, answer_1, answer_2,answer_3,answer_4, correct) VALUES %L RETURNING id',
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

  res.json({ message: "Inesrting successfull" });
};

module.exports = {
  getTest,
  addTest,
  getGroupsTests,
  getTeachersTest,
  addTestToGroup,
  getTestToSolve,
  addAnswerToTest,
  getTestToGrade,
  addGradeToTest,
  getAllTests,
};
