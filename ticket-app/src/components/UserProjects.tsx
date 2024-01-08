import { ENDPIONTS, getUserInfo } from "@api";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FcRules } from "react-icons/fc";

import "./infoBox.css";
import { Project } from "@models";
import { useFetch } from "@hooks";
import { UserProjectsVW } from "@viewModels";

const UserProjects = () => {
  const currentURL = window.location.pathname;
  var currentUser = getUserInfo();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<UserProjectsVW[]>([]);

  const userProjects = useFetch<UserProjectsVW[]>(
    { endPoint: ENDPIONTS.Project.userProjects },
    []
  );

  useEffect(() => {
    if (userProjects?.data?.length > 0) setProjects(userProjects.data);
  }, [userProjects.isFetching]);

  const onProjectSelection = (project: UserProjectsVW) => {
    localStorage.setItem("project", JSON.stringify(project));
    navigate("/", { replace: true });
  };

  return (
    <>
      <div id="infobox3" className="col-xl-12 col-lg-12 layout-spacing">
        <div className="col mt-4">
          <img
            src="/assets/img/astaan.png"
            alt="Sompower logo"
            className="rounded mx-auto d-block"
            style={{ maxWidth: "20%" }}
          />
        </div>
        <div
          className="d-flex flex-wrap"
          style={{ gap: "30px", justifyContent: "center" }}
        >
          {projects?.map((project: UserProjectsVW, i) => (
            <div
              style={{ cursor: "pointer" }}
              key={i}
              className=" infobox-3 col-2 alert alert-light ml-5"
              onClick={() => onProjectSelection(project)}
            >
              <div className="info-icon d-flex justify-content-center">
                <FcRules />
              </div>
              <h5 className="info-heading d-flex justify-content-center">
                {project?.projectName}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserProjects;
