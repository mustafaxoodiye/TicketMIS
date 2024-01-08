import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("sys_user");
    localStorage.removeItem("project");
  }, []);

  return <Navigate to="/auth/login" />;
};

export default Logout;
