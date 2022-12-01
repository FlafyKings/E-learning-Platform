import { useState, useEffect, useStyles } from "react";
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
} from "@mui/material";
import useAuth from "./hooks/useAuth";

function createData(obj) {
  //const counter = 2;
  const id = obj.id;
  const name = obj.name;
  const owner = obj.first_name + " " + obj.last_name;
  const students_count = obj.students_count;
  return { id, name, owner, students_count };
}

const GroupsBoardPage = () => {
  const [group, setGroup] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [loginProf, setLoginProf] = useState();
  const login = window.localStorage.getItem("login");
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

  console.log(group);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        mt: 7,
      }}
    >
      {group ? (
        <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
          <Table sx={{ Width: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">Nazwa</TableCell>
                <TableCell align="center">Nauczyciel</TableCell>
                <TableCell align="center">Ilość studentów</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.map((row, i) => (
                <TableRow
                  className="groupTableHover"
                  onClick={() => {
                    navigate("/groups/" + row.id);
                  }}
                  key={row.counter}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{i + 1}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.owner}</TableCell>
                  <TableCell align="center">{row.students_count}</TableCell>
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
