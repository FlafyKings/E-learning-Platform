import { Typography } from "@mui/material";
import React from "react";
import useCountdown from "./hooks/useCountdown";

const ShowCounter = ({ minutes, seconds }) => {
  return (
    <div>
      <Typography
        sx={{ mb: 2, mt: 2, fontWeight: 500, color: "rgba(0, 0, 0, 0.6)" }}
      >
        {minutes < 10 ? "0" : ""}
        {minutes} : {seconds < 10 ? "0" : ""}
        {seconds}
      </Typography>
    </div>
  );
};

const Countdown = ({ targetDate }) => {
  const [minutes, seconds] = useCountdown(targetDate);

  return <ShowCounter minutes={minutes} seconds={seconds} />;
};

export default Countdown;
