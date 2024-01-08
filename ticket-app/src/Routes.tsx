import AccountRoutes from "./auth/Routes";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { CoreMiddleware } from "@middleware";
import { UserProjects } from "@components";

interface IProps {
  history: any;
}

const AppRoutes: React.FC<IProps> = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AccountRoutes />} />
        <Route path="/auth/*" element={<AccountRoutes />} />
        <Route
          path="/projects/selection"
          element={
            <CoreMiddleware checkProject={false}>
              <UserProjects />
            </CoreMiddleware>
          }
        />
        <Route
          path="*"
          element={
            <CoreMiddleware>
              <App />
            </CoreMiddleware>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
