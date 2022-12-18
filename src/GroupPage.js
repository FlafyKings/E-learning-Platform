import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { Button, Divider, Typography, Box, IconButton } from "@mui/material";
import AddStudentPopUp from "./AddStudentPopUp";
import IncomingGroupTests from "./IncomingGroupTests";
import StudentsTable from "./StudentsTable";
import useAlert from "./hooks/useAlert";
import AddTestPopUp from "./AddTestPopUp";

function createData(obj) {
  const students_id = obj.students_id;
  const first_name = obj.first_name;
  const last_name = obj.last_name;
  const ownerLogin = obj.login;
  return { students_id, first_name, last_name, ownerLogin };
}

const GroupsBoardPage = () => {
  const [rows, setRows] = useState();
  const [groupName, setGroupName] = useState();
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
            <Box>
              <Button onClick={() => handleOpenAddStudent()}>
                Dodaj ucznia
              </Button>
              <Button onClick={() => handleOpenAddTest()}>Dodaj test</Button>
            </Box>
          ) : (
            <></>
          )}
        </>
      ) : (
        <p>Brak grupy do wyświetlenia</p>
      )}
      {rows ? (
        <StudentsTable
          groupId={groupId}
          rows={rows}
          setRows={setRows}
        ></StudentsTable>
      ) : (
        <></>
      )}
      <IncomingGroupTests groupId={groupId}></IncomingGroupTests>
    </Box>
  );
};

export default GroupsBoardPage;
