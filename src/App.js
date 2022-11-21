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
          <Route element={<RequireAuth allowedRoles={[ROLES.Student]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Student, ROLES.Teacher]} />
            }
          >
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Route>
        {/*Missing Pages*/}
        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
};

export default App;
