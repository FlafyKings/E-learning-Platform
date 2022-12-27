import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  months: [
    "Stycznia ",
    "Lutego",
    "Marca",
    "Kwietnia",
    "Maja",
    "Czerwieca",
    "Lipieca",
    "Sierpnia",
    "Września",
    "Października",
    "Listopada",
    "Grudnia",
  ],
});

function Row(props) {
  const { attempts, ungraded, test } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  var attemptsCount = 0;
  var scoreSum = 0;
  var average = 0;

  attempts.map((row) => {
    if (row.testId == test.id) {
      attemptsCount += 1;
      scoreSum += parseInt(row.score);
      average += 1;
    }
  });

  ungraded.map((row) => {
    if (row.testId == test.id) {
      attemptsCount += 1;
    }
  });

  // let gradeCount = 0;
  // let average = 0;

  // grades.map((row) => {
  //   if (row.groupname == group.name) {
  //     gradeCount += 1;
  //     average += parseInt(row.score);
  //   }
  // });

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {test.name}
        </TableCell>
        <TableCell align="left">{attemptsCount}</TableCell>
        <TableCell align="left">
          {scoreSum != 0 ? Math.floor(scoreSum / average) : "Nieocenione"}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                Oceny studentów
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Imie i nazwisko</TableCell>
                    <TableCell align="middle">Ocena</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ungraded.map((row, i) =>
                    row.testId == test.id ? (
                      <TableRow key={"row-" + i}>
                        <TableCell component="th" scope="row">
                          {row.student}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Oceń test">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/test/grade/${row.answerid}`)
                              }
                            >
                              <EditIcon
                                sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                                fontSize="medium"
                                color="success"
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <></>
                    )
                  )}
                  {attempts.map((row, i) =>
                    row.testId == test.id ? (
                      <TableRow key={"row-" + i}>
                        <TableCell component="th" scope="row">
                          {row.student}
                        </TableCell>
                        <TableCell>{row.score}</TableCell>
                      </TableRow>
                    ) : (
                      <></>
                    )
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function ConvertTime(date) {
  var formatter = new Intl.DateTimeFormat("pl", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return formatter.format(date);
}

function createDataTests(obj) {
  const name = obj.name;
  const id = obj.id;
  return { id, name };
}

function createData(obj) {
  const testId = obj.testid;
  const name = obj.name;
  const student = obj.first_name + " " + obj.last_name;
  const answerid = obj.answerid;
  const score = obj?.score ? obj.score : "";
  return { testId, name, student, answerid, score };
}

export default function CollapsibleTable({ groupId }) {
  const login = window.localStorage.getItem("login");
  const [tests, setTests] = useState([]);
  const [ungraded, setUngraded] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  //GETTING INFO FROM THE SERVER
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let groupIdParam = groupId.current;
    const getTest = async () => {
      try {
        const response = await axiosPrivate.get("/test/all/" + groupIdParam, {
          signal: controller.signal,
          params: { groupId: groupIdParam },
        });
        console.log(response);
        isMounted && setTests(response.data.tests);
        setUngraded(response.data.ungraded);
        setAttempts(response.data.allAttempts);

        setTests(
          response.data.tests.rows.map((row) => {
            return createDataTests(row);
          })
        );

        setUngraded(
          response.data.ungraded.rows.map((row) => {
            return createData(row);
          })
        );

        setAttempts(
          response.data.allAttempts.rows.map((row) => {
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

  return (
    <Box sx={{ mb: 8 }}>
      <TableContainer component={Card}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.6)",
            mt: 2,
            mb: 2,
          }}
        >
          Przeprowadzone testy
        </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Test</TableCell>
              <TableCell align="left">Ilość prac</TableCell>
              <TableCell align="left">Średnia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test, i) => (
              <Row
                key={i}
                attempts={attempts}
                ungraded={ungraded}
                test={test}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
