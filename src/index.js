import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./Stylesheets/index.css";
import DashboardPage from "./DashboardPage";
import RegisterPage from "./RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

ReactDOM.createRoot(document.querySelector("#root")).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute isAuth={true}>
            <LoginPage />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/register"
        element={
          <ProtectedRoute isAuth={true}>
            <RegisterPage />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuth={false}>
            <DashboardPage />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/"
        element={
          <ProtectedRoute isAuth={false}>
            <DashboardPage />
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  </BrowserRouter>
);
