import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./Stylesheets/index.css";
import { AuthProvider } from "./context/AuthProvider";
import { AlertProvider } from "./context/AlertProvider";
import App from "./App";

ReactDOM.createRoot(document.querySelector("#root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AlertProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AlertProvider>
    </AuthProvider>
  </BrowserRouter>
);
