import { useState, useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React from "react";
import { Button, Divider, Typography, Card, Box, Avatar } from "@mui/material";
import useAuth from "./hooks/useAuth";

const rolesList = {
  1000: "Student",
  2000: "Nauczyciel",
};

const Profile = () => {
  const [profile, setProfile] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  //const { state } = useLocation();
  const { login } = useParams();
  const { auth } = useAuth();
  const [loginProf, setLoginProf] = useState();

  if (!login) {
    setLoginProf(auth.login);
    // setLoginProf("");
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    //console.log("---------LOGIN PROF", loginProf);
    const getUsersProfile = async () => {
      try {
        const response = await axiosPrivate.get("/profile", {
          signal: controller.signal,
          params: { login: login },
        });
        isMounted && setProfile(response.data.rows[0]);
        console.log("response", response.data.rows[0]);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsersProfile();

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
        width: "100%",
        height: "100%",
        mt: 7,
      }}
    >
      {profile ? (
        <Card
          sx={{
            width: 350,
            height: 500,
            m: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Avatar sx={{ width: 56, height: 56, mt: 3, bgcolor: "#8fa5f2" }}>
            {profile.login[0].toUpperCase()}
          </Avatar>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ fontWeight: 500 }}>
              {profile.first_name[0].toUpperCase() +
                profile.first_name.substring(1)}

              {" " +
                profile.last_name[0].toUpperCase() +
                profile.last_name.substring(1)}
            </Typography>
          </Box>
          <Divider sx={{ width: "100%" }}></Divider>
          <Box sx={{ display: "flex", gap: 1, width: "70%" }}>
            <Typography sx={{ textAlign: "start", fontWeight: 500 }}>
              Login:{" "}
            </Typography>
            <Typography>{profile.login}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, width: "70%" }}>
            <Typography sx={{ textAlign: "start", fontWeight: 500 }}>
              E-mail:{" "}
            </Typography>
            <Typography>{profile.email}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, width: "70%" }}>
            <Typography sx={{ textAlign: "start", fontWeight: 500 }}>
              Rola:{" "}
            </Typography>
            <Typography>{rolesList[profile.role]}</Typography>
          </Box>
        </Card>
      ) : (
        <p>Brak profilu do wyświetlenia</p>
      )}
    </Box>
  );
};

export default Profile;
