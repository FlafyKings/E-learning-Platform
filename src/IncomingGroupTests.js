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
  const time = obj.time;
  const date = new Date(obj.date);
  return { id, name, time, date };
}

const IncomingGroupTests = ({ groupId }) => {
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
    if (test.length != 0) {
      console.log(test);
      console.log(test[0].time % 60);
      console.log(Math.floor(test[0].time / 60));
    }
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
        mb: 8,
      }}
    >
      {test && test?.length != 0 ? (
        <>
          <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
            <Table sx={{ Width: 250 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Nazwa</TableCell>
                  <TableCell align="left">Data</TableCell>
                  <TableCell align="left">Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {test.map((row, i) => (
                  <>
                    {dayjs(row.date)
                      .add(row.time % 60, "minute")
                      .add(Math.floor(row.time / 60), "hour") -
                      dayjs() >
                    0 ? (
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
                          {dayjs(row.date) - dayjs() < 0 &&
                          dayjs(row.date)
                            .add(row.time % 60, "minute")
                            .add(Math.floor(row.time / 60), "hour") -
                            dayjs() >
                            0 ? (
                            <Tooltip title="Rozpocznij test">
                              <IconButton
                                onClick={() =>
                                  navigate(`/test/solve/${row.id}`)
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
        <p>Brak testów w tej grupie</p>
      )}
    </Box>
  );
};

export default IncomingGroupTests;
