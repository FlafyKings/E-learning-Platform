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
  const first_name = obj.first_name;
  const last_name = obj.last_name;
  return { first_name, last_name };
}

const GroupsBoardPage = () => {
  const [group, setGroup] = useState();
  const [groupName, setGroupName] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const login = window.localStorage.getItem("login");
  const groupId = window.location.pathname.replace("/groups/", "");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getGroup = async () => {
      try {
        const response = await axiosPrivate.get("/group/" + groupId, {
          signal: controller.signal,
          params: { login: login, group: groupId },
        });
        console.log(response);
        isMounted && setGroup(response.data.group.rows);
        setGroupName(response.data.groupName.rows[0].name);

        setGroup(
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

  console.log(group);
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
      {groupName ? (
        <>
          <Typography variant="h5">{groupName}</Typography>
          <Divider sx={{ width: "100%", mb: 2, mt: 2 }}></Divider>
          <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
            <Table sx={{ Width: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="center">Imie</TableCell>
                  <TableCell align="center">Nazwisko</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.map((row, i) => (
                  <TableRow
                    className="groupTableHover"
                    key={row.counter}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{i + 1}</TableCell>
                    <TableCell align="center">{row.first_name}</TableCell>
                    <TableCell align="center">{row.last_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <p>Brak grupy do wyświetlenia</p>
      )}
    </Box>
  );
};

export default GroupsBoardPage;
