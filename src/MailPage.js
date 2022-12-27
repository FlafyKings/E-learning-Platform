import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import SendMailPopUp from "./SendMailPopUp";

const MailPage = () => {
  const [open, setOpen] = useState(false);

  const handlePopUp = () => {
    setOpen(!open);
  };

  return (
    <Box>
      {open ? (
        <SendMailPopUp handlePopUp={handlePopUp} open={open}></SendMailPopUp>
      ) : (
        <></>
      )}
      <Typography>Skrzynka Pocztowa</Typography>
      <Button onClick={handlePopUp}>Wyślij wiadomość</Button>
    </Box>
  );
};

export default MailPage;
