import { Outlet } from "react-router-dom";
import React from "react";
import useAuth from "./hooks/useAuth";
import HeaderBar from "./HeaderBar";
import PopUpForm from "./PopUpForm";
import Loading from "./Loading";

const Layout = () => {
  const { auth } = useAuth();
  return (
    <main className="App">
      {Object.keys(auth).length === 0 ? <></> : <HeaderBar></HeaderBar>}
      {/*auth?.newUser ? <PopUpForm></PopUpForm> : <></>*/}
      <Outlet />
    </main>
  );
};

export default Layout;
