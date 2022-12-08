import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React from "react";
import {
  Button,
  Divider,
  Typography,
  Card,
  Box,
  AvatarTable,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddStudentPopUp from "./AddStudentPopUp";
import GroupTests from "./GroupTests";
import SendIcon from "@mui/icons-material/Send";
import StudentsTable from "./StudentsTable";

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
  const [open, setOpen] = useState(false);
  const groupId = useRef();

  groupId.current = window.location.pathname.replace("/groups/", "");

  const handleOpenAdd = () => {
    setOpen(true);
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
      {open ? (
        <AddStudentPopUp
          open={open}
          setOpen={setOpen}
          groupId={groupId}
        ></AddStudentPopUp>
      ) : (
        <></>
      )}
      {groupName ? (
        <>
          <Typography sx={{ color: "rgba(0, 0, 0, 0.6)" }} variant="h5">
            {groupName}
          </Typography>
          <Divider sx={{ width: "100%", mb: 2, mt: 2 }}></Divider>
          <Button onClick={() => handleOpenAdd()}>Dodaj ucznia</Button>
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
      <GroupTests groupId={groupId}></GroupTests>
    </Box>
  );
};

export default GroupsBoardPage;
