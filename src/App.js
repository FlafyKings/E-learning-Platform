import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import Layout from "./Layout";
import RequireAuth from "./RequireAuth";
import MissingPage from "./MissingPage";
import useAuth from "./hooks/useAuth";
import UnauthorizedPage from "./UnauthorizedPage";

const ROLES = {
  Student: 1000,
  Teacher: 2000,
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*Public pages everyone has access to*/}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.Student]} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        {/*Missing Pages*/}
        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
};

export default App;
