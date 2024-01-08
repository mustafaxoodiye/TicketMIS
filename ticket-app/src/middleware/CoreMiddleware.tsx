import { getUserInfo, getUserProject } from "@api";
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  checkProject?: boolean;
}

export const CoreMiddleware: React.FC<Props> = ({
  children,
  checkProject = true,
}) => {
  const currentURL = window.location.pathname;
  var currentUser = getUserInfo();
  var currentProject = getUserProject();

  // Check user Token
  try {
    if (!currentUser?.token) {
      return <Navigate to={`/auth/login?returnUrl=${currentURL}`} />;
    }
  } catch (error) {
    return <Navigate to={`/auth/login?returnUrl=${currentURL}`} />;
  }

  // Check if user Project is selected and in the local storage
  if (checkProject && !currentProject) {
    return <Navigate to={`/projects/selection`} />;
  }

  return <>{children}</>;
};
