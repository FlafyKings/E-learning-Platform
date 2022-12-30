import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { Box } from "@mui/system";
import { Card, Divider, Typography, Button } from "@mui/material";
import dayjs from "dayjs";

const MailText = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = useState([]);

  const mailId = useRef();
  const login = window.localStorage.getItem("login");
  mailId.current = window.location.pathname.replace("/mail/text/", "");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getMail = async () => {
      try {
        const response = await axiosPrivate.get(
          "/mail/text/" + mailId.current,
          {
            signal: controller.signal,
            params: { mailId: mailId.current },
          }
        );
        console.log(response);
        isMounted && setRows(response.data.sentMail.rows[0]);

        //    setRows(
        //      response.data.mail.rows.map((row) => {
        //        return createData(row);
        //      })
        //    );
        //    setRowsSent(
        //      response.data.sentMail.rows.map((row) => {
        //        return createData(row);
        //      })
        //    );
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getMail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          minWidth: 320,
          minHeight: 500,
          width: "50vw",
          maxHeight: "80vh",
          mt: 7,
        }}
      >
        <Button onClick={() => navigate("/mail")} sx={{ mt: 0.5, ml: 0.5 }}>
          Wróć
        </Button>
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", mt: 2, mb: 2 }}
        >
          <Box sx={{ width: "33%", ml: 3 }}>
            <Typography>
              <b>Od:</b> {rows.senderfirstname + " " + rows.senderlastname}{" "}
            </Typography>
            <Typography>
              {" "}
              <b>Do:</b> {rows.receiverfirstname + " " + rows.receiverlastname}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "33%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ textAlign: "center" }}>
              {" "}
              <b>Tytuł: </b>
              {rows.title}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "33%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                textAlign: "right",
              }}
            >
              <b>Wysłano: </b>{" "}
              {dayjs(rows.timestamp).format("D MMMM YYYY H:mm")}
            </Typography>
          </Box>
        </Box>
        <Divider></Divider>
        <Typography sx={{ ml: 2, mt: 1 }}>
          <b>Treść maila:</b>
        </Typography>
        <Typography sx={{ ml: 2, mt: 2 }}>{rows.text}</Typography>
      </Card>
    </Box>
  );
};

export default MailText;
