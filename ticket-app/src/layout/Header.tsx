import { NavLink, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { getUserInfo, getUserProject } from "@api";
import { TicketStatus } from "@viewModels";

let availableStatuses: string[] = [];

const Header = () => {
  const navigate = useNavigate();

  var currentProject = getUserProject();
  var currentUser = getUserInfo();

  availableStatuses = currentUser.accessableTickets;

  const handleTicketViewType = (value: string) => {
    if (!value) return;

    navigate(`/tickets/${value}`);
  };

  return (
    <div className="header-container fixed-top">
      <header className="header navbar navbar-expand-sm">
        <ul className="navbar-item theme-brand flex-row  text-center">
          <li className="nav-item theme-logo">
            <a href="index.html">
              <img
                src="/assets/img/90x90.png"
                className="navbar-logo"
                alt="logo"
              />
            </a>
          </li>
          <li className="nav-item theme-text">
            <NavLink to="/" className="nav-link">
              {" "}
              Ticket MIS - {currentProject?.projectName}
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-item flex-row ml-md-0 ml-auto">
          <li className="nav-item align-self-center search-animated">
            <div className="form-inline search-full form-inline search">
              <div className="search-bar">
                <select
                  style={{
                    backgroundColor: "rgba(81, 83, 101, 0.28)",
                    color: "#888ea8",
                    height: "45px",
                    borderRadius: "6px",
                  }}
                  className="form-control search-form-control  ml-lg-auto select"
                  onChange={(e) => handleTicketViewType(e.target.value)}
                >
                  <option> </option>
                  <option value="MyTickets"> MyTickets</option>
                  {Object.keys(TicketStatus)
                    .filter((f) => availableStatuses.includes(f))
                    .map((d, i) => (
                      <option key={i} value={d}>
                        {d.replace("_", " ")}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </li>
        </ul>
        <ul className="navbar-item flex-row ml-md-auto">
          <li className="nav-item dropdown user-profile-dropdown">
            <a
              href="!#"
              className="nav-link dropdown-toggle user"
              id="userProfileDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              {/* <img src="assets/img/90x90.jpg" alt="avatar" /> */}
              <FiUser color="white" size="20" />
            </a>
            <div
              className="dropdown-menu position-absolute"
              aria-labelledby="userProfileDropdown"
            >
              <div>
                <div className="dropdown-item">
                  <a href="user_profile.html">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-user"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                    Change Password
                  </a>
                </div>
                <div className="dropdown-item">
                  <NavLink to="/auth/logout">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-log-out"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1={21} y1={12} x2={9} y2={12} />
                    </svg>
                    Sign Out
                  </NavLink>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Header;
