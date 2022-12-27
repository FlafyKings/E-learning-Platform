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
import { Divider } from "@mui/material";

function createData(score, date, testname, groupname) {
  return {
    score,
    date,
    testname,
    groupname,
  };
}

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
  const { grades, group } = props;
  const [open, setOpen] = React.useState(false);

  let gradeCount = 0;
  let average = 0;

  grades.map((row) => {
    if (row.groupname == group.name) {
      gradeCount += 1;
      average += parseInt(row.score);
    }
  });

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
          {group.name}
        </TableCell>
        <TableCell align="left">{gradeCount}</TableCell>
        <TableCell align="left">
          {gradeCount != 0
            ? Math.floor(average / gradeCount) + "%"
            : "Brak ocen"}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Oceny
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Typ</TableCell>
                    <TableCell align="right">Nazwa</TableCell>
                    <TableCell align="right">Ocena</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grades.map((row, i) =>
                    row.groupname == group.name ? (
                      <TableRow key={"row-" + i}>
                        <TableCell component="th" scope="row">
                          {dayjs(row.date).format("D MMMM YYYY")}
                        </TableCell>
                        <TableCell>
                          {row?.testname ? "Test" : "Zadanie domowe"}
                        </TableCell>
                        <TableCell align="right">
                          {row?.testname ? row.testname : row.homeworkname}
                        </TableCell>
                        <TableCell align="right">{row.score}%</TableCell>
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

export default function CollapsibleTable() {
  const login = window.localStorage.getItem("login");
  const [grades, setGrades] = useState([]);
  const [groups, setGroups] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  //GETTING INFO FROM THE SERVER
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getGrades = async () => {
      try {
        const response = await axiosPrivate.get("/grade/user/" + login, {
          signal: controller.signal,
          params: { login: login },
        });
        isMounted && setGrades(response.data.grades.rows);

        setGroups(response.data.groups.rows);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getGrades();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log(grades, groups);
  }, [groups]);

  return (
    <Box>
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
        Oceny studenta
      </Typography>
      <Divider sx={{ mb: 4 }}></Divider>
      <TableContainer component={Card}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Nazwa grupy</TableCell>
              <TableCell align="left">Ilość ocen</TableCell>
              <TableCell align="left">Średnia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group, i) => (
              <Row key={i} grades={grades} group={group} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
