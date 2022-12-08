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
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConstructionOutlined } from "@mui/icons-material";

function createData(obj) {
  const name = obj.name;
  const time = obj.time;
  const date = obj.date;
  return { name, time, date };
}

const GroupTests = ({ groupId }) => {
  const [test, setTest] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let groupIdParam = groupId.current;
    const getTest = async () => {
      try {
        const response = await axiosPrivate.get("/test/" + groupIdParam, {
          signal: controller.signal,
          params: { groupId: groupIdParam },
        });
        console.log(response);
        isMounted && setTest(response.data);

        setTest(
          response.data.map((row) => {
            return createData(row);
          })
        );
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getTest();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log(test);
  }, [test]);

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
      {test && test?.length != 0 ? (
        <>
          <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
            <Table sx={{ Width: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="center">Nazwa</TableCell>
                  <TableCell align="center">Data</TableCell>
                  <TableCell align="center">Czas</TableCell>
                  <TableCell align="center" className="shortTableCell">
                    Akcje
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {test.map((row, i) => (
                  <TableRow
                    className="groupTableHover"
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="left">{i + 1}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      {row.date.slice(0, 10) + " " + row.date.slice(11, 16)}
                    </TableCell>
                    <TableCell align="center">{row.time + " minut"}</TableCell>
                    <TableCell className="shortTableCell">
                      {row.name ? (
                        <>
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
        </>
      ) : (
        <p>Brak testów w tej grupie</p>
      )}
    </Box>
  );
};

export default GroupTests;
