import React from "react";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import Layout from "./Layout";
import RequireAuth from "./RequireAuth";
import PersistLogin from "./PersistLogin";
import MissingPage from "./MissingPage";
import UnauthorizedPage from "./UnauthorizedPage";
import ChatPage from "./ChatPage";
import Profile from "./Profile";
import GroupsBoardPage from "./GroupsBoardPage";
import GroupPage from "./GroupPage";
import TestPage from "./TestPage";
import TestCreator from "./TestCreator";

const ROLES = {
  Student: "1000",
  Teacher: "2000",
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*Public pages everyone has access to*/}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        {/*<Route path="/dashboard" element={<DashboardPage />} />*/}
        <Route element={<PersistLogin />}>
          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Student, , ROLES.Teacher]} />
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Student, ROLES.Teacher]} />
            }
          >
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Teacher]} />}>
            <Route path="/testCreator" element={<TestCreator />}></Route>
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Student, ROLES.Teacher]} />
            }
          >
            <Route path="/profile">
              <Route path=":login" element={<Profile />} />
            </Route>
            <Route path="/groups/:group" element={<GroupPage />}></Route>
            <Route path="/groups" element={<GroupsBoardPage />} />
            <Route path="/test/:id" element={<TestPage />} />
          </Route>
        </Route>
        {/*Missing Pages*/}
        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
};

export default App;
