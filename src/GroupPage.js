import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import {
  Button,
  Divider,
  Typography,
  Box,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import AddStudentPopUp from "./AddStudentPopUp";
import IncomingGroupTests from "./IncomingGroupTests";
import StudentsTable from "./StudentsTable";
import StudentsTableTeacher from "./StudentsTableTeacher";
import useAlert from "./hooks/useAlert";
import AddTestPopUp from "./AddTestPopUp";
import TeacherTestTable from "./TeacherTestTable";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import IncomingGroupHomework from "./IncomingGroupHomework";
import TeacherHomeworkTable from "./TeacherHomeworkTable";

function createData(obj) {
  const students_id = obj.students_id;
  const first_name = obj.first_name;
  const last_name = obj.last_name;
  const ownerLogin = obj.login;
  const studentLogin = obj.studentlogin;
  return { students_id, first_name, last_name, ownerLogin, studentLogin };
}

const GroupsBoardPage = () => {
  const [rows, setRows] = useState();
  const [groupName, setGroupName] = useState();
  const [grades, setGrades] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const login = window.localStorage.getItem("login");
  const [openStudent, setOpenStudent] = useState(false);
  const [openTest, setOpenTest] = useState(false);
  const groupId = useRef();

  //ALERT STATES
  //const { setAlert, setAlertMessage, setAlertType } = useAlert();

  groupId.current = window.location.pathname.replace("/groups/", "");

  const handleOpenAddStudent = () => {
    setOpenStudent(true);
  };

  const handleOpenAddTest = () => {
    setOpenTest(true);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let groupIdParam = groupId.current;
    const getGroup = async () => {
      try {
        const response = await axiosPrivate.get("/group/" + groupIdParam, {
          signal: controller.signal,
          params: { login: login, group: groupIdParam },
        });
        console.log(response);
        isMounted && setRows(response.data.group.rows);
        setGroupName(response.data.groupName.rows[0].name);

        setRows(
          response.data.group.rows.map((row) => {
            return createData(row);
          })
        );
        // let arrayTemp = [];
        // response.data.grades.rows.map((row) => {
        //   if (row.score != null) {
        //     arrayTemp.push(row);
        //   }
        // });

        setGrades(response.data.grades.rows);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getGroup();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log(grades);
  }, [grades]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        mt: 7,
      }}
    >
      {openStudent ? (
        <AddStudentPopUp
          open={openStudent}
          setOpen={setOpenStudent}
          groupId={groupId}
        ></AddStudentPopUp>
      ) : (
        <></>
      )}
      {openTest ? (
        <AddTestPopUp
          open={openTest}
          setOpen={setOpenTest}
          groupId={groupId}
        ></AddTestPopUp>
      ) : (
        <></>
      )}
      {groupName ? (
        <>
          <Typography sx={{ color: "rgba(0, 0, 0, 0.6)" }} variant="h5">
            {groupName}
          </Typography>
          <Divider sx={{ width: "100%", mb: 2, mt: 2 }}></Divider>
          {rows[0].ownerLogin === login ? (
            <Box sx={{ mb: 2 }}>
              <Button
                endIcon={<PersonIcon></PersonIcon>}
                sx={{ mr: 2 }}
                variant="contained"
                onClick={() => handleOpenAddStudent()}
              >
                Dodaj ucznia
              </Button>
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                endIcon={<HomeWorkIcon></HomeWorkIcon>}
                onClick={() => navigate("/homeworkCreator/" + groupId.current)}
              >
                Dodaj zadanie
              </Button>
              <Button
                endIcon={<ArticleIcon></ArticleIcon>}
                variant="contained"
                onClick={() => handleOpenAddTest()}
              >
                Dodaj test
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Paper sx={{ width: 400, height: 200 }}>
          <Typography sx={{ textAlign: "center" }}>
            Brak grupy do wyświetlenia
          </Typography>
        </Paper>
      )}
      <Box sx={{ display: { lg: "flex" }, gap: 4 }}>
        {rows ? (
          rows[0].ownerLogin === login ? (
            <StudentsTableTeacher
              groupId={groupId}
              rows={rows}
              setRows={setRows}
              grades={grades}
            ></StudentsTableTeacher>
          ) : (
            <StudentsTable
              groupId={groupId}
              rows={rows}
              setRows={setRows}
            ></StudentsTable>
          )
        ) : (
          <></>
        )}
        <Box>
          {rows && rows[0].ownerLogin === login ? (
            <TeacherTestTable groupId={groupId}></TeacherTestTable>
          ) : (
            <></>
          )}
          {rows && rows[0].ownerLogin === login ? (
            <TeacherHomeworkTable groupId={groupId}></TeacherHomeworkTable>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box>
        <IncomingGroupTests groupId={groupId}></IncomingGroupTests>
        <IncomingGroupHomework groupId={groupId}></IncomingGroupHomework>
      </Box>
    </Box>
  );
};

export default GroupsBoardPage;
