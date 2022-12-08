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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import useAuth from "./hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AddStudentPopUp from "./AddStudentPopUp";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";

function createData(obj) {
  //const counter = 2;
  const id = obj.id;
  const name = obj.name;
  const owner = obj.first_name + " " + obj.last_name;
  const ownerLogin = obj.login;
  const students_count = obj.students_count;
  return { id, name, owner, students_count, ownerLogin };
}

const GroupsBoardPage = () => {
  const [group, setGroup] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [loginProf, setLoginProf] = useState();
  const login = window.localStorage.getItem("login");
  const groupId = useRef();

  const handleOpenAdd = (id) => {
    setOpen(true);
    groupId.current = id;
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsersGroups = async () => {
      try {
        const response = await axiosPrivate.get("/group", {
          signal: controller.signal,
          params: { login: login },
        });
        isMounted && setGroup(response.data.rows);
        setGroup(
          response.data.rows.map((row) => {
            return createData(row);
          })
        );
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsersGroups();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setAlert(false);
    }, 5000);
  }, [alert]);

  console.log(group);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Collapse in={alert}>
        {alert ? (
          <Alert
            sx={{ width: 330, mt: 1 }}
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Dodano ucznia do grupy!
          </Alert>
        ) : (
          <></>
        )}
      </Collapse>
      {open ? (
        <AddStudentPopUp
          open={open}
          setOpen={setOpen}
          groupId={groupId}
          group={group}
          setAlert={setAlert}
        ></AddStudentPopUp>
      ) : (
        <></>
      )}
      {group ? (
        <TableContainer component={Paper} sx={{ maxWidth: 1000, mt: 7 }}>
          <Table sx={{ Width: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">Nazwa</TableCell>
                <TableCell align="center">Nauczyciel</TableCell>
                <TableCell className="shortTableCell" align="center">
                  Ilość studentów
                </TableCell>
                <TableCell align="center" className="shortTableCell">
                  Akcje
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="tableBodyGroups">
              {group.map((row, i) => (
                <TableRow
                  className="groupTableHover"
                  key={row.counter}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    onClick={() => {
                      navigate("/groups/" + row.id);
                    }}
                    align="left"
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      navigate("/groups/" + row.id);
                    }}
                    align="center"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      navigate("/groups/" + row.id);
                    }}
                    align="center"
                  >
                    {row.owner}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      navigate("/groups/" + row.id);
                    }}
                    align="center"
                    className="shortTableCell"
                  >
                    {row.students_count}
                  </TableCell>
                  <TableCell className="shortTableCell">
                    {row.ownerLogin == login ? (
                      <>
                        <Tooltip title="Dodaj uczniów">
                          <IconButton onClick={() => handleOpenAdd(row.id)}>
                            <AddIcon fontSize="medium" color="success" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edytuj grupe">
                          <IconButton>
                            <EditIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Usuń">
                          <IconButton>
                            <DeleteIcon fontSize="medium" color="error" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>Brak grupy do wyświetlenia</p>
      )}
    </Box>
  );
};

export default GroupsBoardPage;
