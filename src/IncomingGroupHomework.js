import { useState, useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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

function createData(obj) {
  const id = obj.id;
  const name = obj.name;
  const question = obj.question;
  const date = new Date(obj.deadline);
  return { id, name, date, question };
}

const IncomingGroupHomework = ({ groupId }) => {
  const [test, setTest] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const now = dayjs();

  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "za %s",
      past: "%s temu",
      s: "kilka sekund",
      m: "minute",
      mm: "%d minut",
      h: "godzine",
      hh: "%d godzin",
      d: "dzień",
      dd: "%d dni",
      M: "miesiąc",
      MM: "%d miesiące",
      y: "rok",
      yy: "%d lat",
    },
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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let groupIdParam = groupId.current;
    const getTest = async () => {
      try {
        const response = await axiosPrivate.get("/homework/" + groupIdParam, {
          signal: controller.signal,
          params: { groupId: groupIdParam },
        });
        console.log(response);
        isMounted && setTest(response.data);

        setTest(
          response.data.homework.rows.map((row) => {
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
    if (test.length != 0) {
      console.log(test);
    }
  }, [test]);

  return (
    <Box sx={{ width: { xs: 400, lg: 600, md: 500 } }}>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          mt: 7,
          mb: 8,
          pt: 2,
          pb: 2,
        }}
      >
        <Typography
          sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", mb: 1 }}
        >
          Nadchodzące zadania domowe
        </Typography>
        {test && test?.length != 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table
                sx={{ width: { xs: 400, lg: 600, md: 500 } }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Nazwa</TableCell>
                    <TableCell align="left">Termin</TableCell>
                    <TableCell align="left">Akcje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {test.map((row, i) => (
                    <>
                      {dayjs(row.date) - dayjs() > 0 ? (
                        <TableRow
                          key={i}
                          className="groupTableHover"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell>{dayjs(row.date).fromNow()}</TableCell>
                          <TableCell>
                            {dayjs(row.date) - dayjs() > 0 ? (
                              <Tooltip title="Odeślij zadanie">
                                <IconButton
                                  onClick={() =>
                                    navigate(`/homework/solve/${row.id}`)
                                  }
                                >
                                  <OpenInNewIcon
                                    sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <></>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography sx={{ color: "rgba(0, 0, 0, 0.6)", textAlign: "center" }}>
            Brak zadań w tej grupie
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default IncomingGroupHomework;
