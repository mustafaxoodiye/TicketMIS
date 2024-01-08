import { TicketStatus } from "@viewModels";
import { FiAirplay, FiArchive, FiClipboard, FiUsers } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleTicketViewType = (e: any, ticketStatus?: TicketStatus) => {
    e.preventDefault();

    navigate(`/tickets/${ticketStatus ?? "MyTickets"}`);
  };

  return (
    <div className="sidebar-wrapper sidebar-theme">
      <nav id="sidebar">
        {/* <div className="shadow-bottom" /> */}
        <ul className="list-unstyled menu-categories" id="accordionExample">
          <li className="menu">
            <NavLink to="/" aria-expanded="false" className="dropdown-toggle">
              <div>
                <FiAirplay />
                <span>Dashboard</span>
              </div>
            </NavLink>
          </li>
          <li className="menu">
            <NavLink
              to="/invoices/payment"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <div>
                <FiClipboard />
                <span>Ticket Info.</span>
              </div>
            </NavLink>
          </li>
          {/* <li className="menu">
            <a
              href="#reports"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <div>
                <FiArchive />
                <span>Issued Tickets</span>
              </div>
              <div>
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
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </a>
            <ul
              className="collapse submenu list-unstyled"
              id="reports"
              data-parent="#accordionExample"
            >
              <li>
                <a href="!#" onClick={(e) => handleTicketViewType(e)}>
                  My Tickets
                </a>
              </li>
              <li>
                <a
                  href="!#"
                  onClick={(e) => handleTicketViewType(e, TicketStatus.New)}
                >
                  New Tickets
                </a>
              </li>
              <li>
                <a
                  href="!#"
                  onClick={(e) =>
                    handleTicketViewType(e, TicketStatus.Assigned)
                  }
                >
                  Assigned Tickets
                </a>
              </li>
              <li>
                <a
                  href="!#"
                  onClick={(e) =>
                    handleTicketViewType(e, TicketStatus.Approved)
                  }
                >
                  Approvals
                </a>
              </li>
              <li>
                <a
                  href="!#"
                  onClick={(e) =>
                    handleTicketViewType(e, TicketStatus.In_Progress)
                  }
                >
                  In Progress
                </a>
              </li>
              <li>
                <a
                  href="!#"
                  onClick={(e) => handleTicketViewType(e, TicketStatus.On_Hold)}
                >
                  On Hold Tickets
                </a>
              </li>
              <li>
                <a
                  href="!#"
                  onClick={(e) =>
                    handleTicketViewType(e, TicketStatus.To_Discuss)
                  }
                >
                  To Discussed Tickets
                </a>
              </li>
              <li>
                <a
                  href="!#"
                  onClick={(e) =>
                    handleTicketViewType(e, TicketStatus.Resolved)
                  }
                >
                  Resolved Tickets
                </a>
              </li>
            </ul>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
