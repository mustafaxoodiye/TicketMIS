import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";

const AccountRoutes = () => {
  return (
    <Routes>
      <Route path="logout" element={<Logout />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AccountRoutes;
