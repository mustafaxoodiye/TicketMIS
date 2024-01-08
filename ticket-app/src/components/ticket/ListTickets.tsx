import {
  ENDPIONTS,
  getUserInfo,
  httpService,
  Operation,
  PaginatedResult,
  PagingOptions,
} from "@api";
import { MyContainer, NewTicket } from "@components";
import { useFetch } from "@hooks";
import { Ticket } from "@models";
import {
  Action,
  ComplexHeader,
  Filterable,
  MyRingLoader,
  Table,
  TableVerticalConfigs,
  PaginationHandler,
} from "@utils";
import { TicketPriorityLevel, TicketStatus } from "@viewModels";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiSettings } from "react-icons/fi";

// export type

const ListTickets = () => {
  const tStatus = useParams().status;

  var currentUser = getUserInfo();

  const [queryStrings, setSearchParams] = useSearchParams();
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const [reload, setReload] = useState<boolean | undefined>(undefined);
  const [tickets, setTickets] = useState<PaginatedResult<Ticket>>(
    new PaginatedResult<Ticket>()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("My Tickets");
  const [pageNo, setPageNo] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState("");

  useLayoutEffect(() => {
    if (typeof queryStrings.get("page") === "string") {
      setPageNo(+queryStrings.get("page")! + 1);
    } else {
      setPageNo(null);
    }

    (async function () {
      var params = new URLSearchParams();
      params = queryStrings;
      if (tStatus !== "MyTickets") {
        params.set("status", tStatus as TicketStatus);
      } else {
        params.delete("status");
      }

      var res = await httpService(ENDPIONTS.Ticket.tickets, params).getAll();
      if (res?.status === 200) setTickets(res?.data);
      setIsLoading(false);
    })();

    let options = new PagingOptions();
    options.filter<Ticket>((f) => f.eq("assignedTo", "bla"));

    if (tStatus === "MyTickets")
      options.filter<Ticket>((f) => f.eq("createdBy", "5"));

    console.log("param is: ", options.format(queryStrings));
    console.log("query strings are is: ", queryStrings.toString());

    return () => {
      setTickets(new PaginatedResult<Ticket>());
      setIsLoading(true);
    };
  }, [tStatus, queryStrings, currentUser.userId, reload]);

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    switch (tStatus) {
      case TicketStatus.New.capitalize():
        setTitle("New Tickets");
        break;
      case TicketStatus.Approved.capitalize():
        setTitle("Approved Tickets");
        break;
      case TicketStatus.On_Hold.capitalize():
        setTitle("On Hold Tickets");
        break;
      case TicketStatus.In_Progress.capitalize():
        setTitle("In Progress Tickets");
        break;
      case TicketStatus.Rejected.capitalize():
        setTitle("Rejected Tickets");
        break;
      case TicketStatus.To_Discuss.capitalize():
        setTitle("To Be Discussed Tickets");
        break;
      case TicketStatus.Resolved.capitalize():
        setTitle("Resolved Tickets");
        break;
      case TicketStatus.Pending_Approval.capitalize():
        setTitle("Pending Approval Tickets");
        break;

      default:
        setTitle("My Tickets");
        break;
    }
  }, [tStatus]);

  const headers: ComplexHeader[] = [
    { key: "title", title: "Title" },
    {
      key: "priority",
      title: "priority",
      cellClass: (u: Ticket) => handlePriorityBadgeCOlor(u.priority),
    },
    {
      key: "status",
      title: "status",
      formatter: (status: string) => status?.capitalize()?.replace("_", " "),
      cellClass: (u: Ticket) => handleStatusBadgeColor(u.status),
    },
    { key: "assignedTo?.userName", title: "assigned To" },
    { key: "createdBy?.userName", title: "By" },
    { key: "createdAt", title: "@", format: "date" },
  ];

  const handlePriorityBadgeCOlor = (priority: string) => {
    if (priority === TicketPriorityLevel.High) return "badge badge-danger";
    if (priority === TicketPriorityLevel.Medium) return "badge badge-warning";

    return "badge badge-dark";
  };

  const handleStatusBadgeColor = (status: string) => {
    if (status === TicketStatus.Pending_Approval) return "badge badge-warning";
    if (status === TicketStatus.Approved) return "badge badge-primary";
    if (status === TicketStatus.Rejected) return "badge badge-danger";
    if (status === TicketStatus.In_Progress) return "badge badge-info";
    if (status === TicketStatus.On_Hold) return "badge badge-dark";
    if (status === TicketStatus.Resolved) return "badge badge-success";

    return "badge badge-secondary";
  };

  const handleTicketColor = (status: string) => {
    // if (status === TicketStatus.Pending_Approval) return "#CFF5E7";
    // if (status === TicketStatus.Approved) return "#7DE5ED";
    // if (status === TicketStatus.Rejected) return "#ffe1e2";
    // if (status === TicketStatus.In_Progress) return "#bae7ff";
    // if (status === TicketStatus.On_Hold) return "#ffeccb";
    // if (status === TicketStatus.Resolved) return "#D7E9B9";
    // if (status === TicketStatus.To_Discuss) return "#F3EFE0";

    if (
      status === TicketStatus.Pending_Approval ||
      status === TicketStatus.Approved ||
      status === TicketStatus.In_Progress
    )
      return "#ffeccb";
    if (status === TicketStatus.On_Hold || status === TicketStatus.To_Discuss)
      return "#E0E6ED";
    if (status === TicketStatus.Resolved) return "#D7E9B9";
    if (status === TicketStatus.Rejected) return "#ffe1e2";

    return "#bae7ff";
  };

  const filters: Filterable<Ticket>[] = [
    {
      key: "title",
      title: "Title",
      format: "text",
      operation: Operation.like,
    },
    {
      key: "status",
      title: "Ticket Status",
      format: "select",
      data: [
        ...Object.keys(TicketStatus)?.map((a) => ({
          id: a,
          name: a.replace("_", " "),
        })),
      ],
    },
    {
      key: "priority",
      title: "Priority Level",
      format: "select",
      data: [
        ...Object.keys(TicketPriorityLevel)?.map((a) => ({
          id: a,
          name: a,
        })),
      ],
    },
  ];

  const actions: Action[] = [
    {
      key: "T_details",
      actionType: "badge",
      click: (t: Ticket) => {
        onAddTicketClickHandler(t);
      },
      title: "Details",
      color: "dark",
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    queryStrings.set("size", size.toString());
    queryStrings.set("page", (page - 1).toString());

    navigate({ search: `?${queryStrings.toString()}` });
  };

  const onAddTicketClickHandler = (t?: Ticket) => {
    MySwal.fire({
      showConfirmButton: false,
      allowOutsideClick: false,
      showCloseButton: true,
      width: 1500,
      html: (
        <NewTicket
          tStatus={
            tStatus === "MyTickets" ? undefined : (tStatus as TicketStatus)
          }
          ticket={t}
          callback={() =>
            setReload((prev) => (prev === undefined ? true : !prev))
          }
        />
      ),
    });
  };

  return (
    <>
      <MyContainer head={title} title={title} size="col-12">
        <div className="content container-fluid">
          <div className="row align-items-center">
            <div className="col"></div>
            <div className="col-auto float-end ms-auto">
              {!tStatus && (
                <button
                  className="btn btn-sm btn-primary rounded-circle m-1"
                  onClick={() => onAddTicketClickHandler()}
                >
                  <FiPlus />
                </button>
              )}
              <TableVerticalConfigs filters={filters} />
            </div>
          </div>

          <div className="col-12 mt-3">
            <Table
              actions={actions}
              class="table table-sm table-hover mb-0"
              data={tickets}
              headers={headers}
              isFetchingPage={isLoading}
              showCounter
              onPageChange={handlePageChange}
              paginationClass="d-flex justify-content-center mt-3"
            />
          </div>
        </div>
      </MyContainer>

      {isLoading ? (
        <MyRingLoader />
      ) : (
        <div className={"layout-px-spacing"}>
          <div className="d-flex justify-content-center">
            <h4 className="font-weight-bold">{title}</h4>
          </div>
          <div className="d-flex justify-content-around">
            <div className="d-flex">
              {tStatus === "MyTickets" && (
                <button
                  className="btn btn-sm btn-primary rounded-circle m-1"
                  onClick={() => onAddTicketClickHandler()}
                >
                  <FiPlus />
                </button>
              )}
              {tickets?.items?.length > 0 && (
                <TableVerticalConfigs filters={filters} />
              )}
            </div>
            <PaginationHandler
              totalPages={tickets?.totalPages}
              size={tickets?.size}
              onPageChange={handlePageChange}
            />
            {pageNo && tickets?.totalPages > 0 && (
              <div className="d-flex">
                <span className="font-weight-bold">
                  {" "}
                  Page {pageNo} of {tickets?.totalPages}
                </span>
              </div>
            )}
          </div>
          {tStatus !== "MyTickets" ? (
            <div className="row px-3 mt-3" style={{ rowGap: "20px" }}>
              {tickets?.items?.map((ticket, idx) => {
                return (
                  <div
                    className="col-4"
                    style={{ cursor: "pointer" }}
                    onClick={() => onAddTicketClickHandler(ticket)}
                  >
                    <div
                      style={{
                        background: handleTicketColor(ticket.status),
                        border: "none",
                      }}
                      className="card p-3"
                    >
                      <h4>
                        {ticket.title?.substring(0, 20)}
                        {ticket?.title?.length > 20 && "..."}
                      </h4>
                      <div className="d-flex justify-content-between mt-1">
                        <span>
                          {new Date(ticket.createdAt).toLocaleString()}
                        </span>
                        <span className="font-weight-bold">
                          Ticket ID #{ticket?.id}
                        </span>
                      </div>
                      <span className="mt-3 font-weight-bold text-dark">
                        Created By: {ticket?.createdBy?.userName ?? "N/A"}
                      </span>
                      <span className="font-weight-bold text-dark">
                        Assigned To: {ticket?.assignedTo?.name ?? "N/A"} -{" "}
                        {ticket?.responsible?.userName ?? "N/A"}
                      </span>
                      <div className="d-flex justify-content-between mt-5">
                        <div className="d-flex" style={{ gap: "5px" }}>
                          <span
                            className={`badge ${handlePriorityBadgeCOlor(
                              ticket.priority
                            )}`}
                          >
                            Priority: {ticket.priority}
                          </span>
                          |
                          <span
                            className={`badge ${handleStatusBadgeColor(
                              ticket.status
                            )}`}
                          >
                            Status: {ticket.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="row px-3 mt-3" style={{ rowGap: "20px" }}>
              <div className="col-4 ">
                <h4 className="d-flex justify-content-center">New</h4>
                {tickets?.items
                  ?.filter((i) => i.status === TicketStatus.New)
                  ?.map((ticket, idx) => {
                    return (
                      <div
                        className="my-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => onAddTicketClickHandler(ticket)}
                      >
                        <div
                          style={{
                            background: handleTicketColor(ticket.status),
                            border: "none",
                          }}
                          className="card p-3"
                        >
                          <h4>
                            {ticket.title?.substring(0, 20)}
                            {ticket?.title?.length > 20 && "..."}
                          </h4>
                          <div className="d-flex justify-content-between mt-1">
                            <span>
                              {new Date(ticket.createdAt).toLocaleString()}
                            </span>
                            <span className="font-weight-bold">
                              Ticket ID #{ticket?.id}
                            </span>
                          </div>
                          <span className="mt-3 font-weight-bold text-dark">
                            Created By: {ticket?.createdBy?.userName ?? "N/A"}
                          </span>
                          <span className="font-weight-bold text-dark">
                            Assigned To: {ticket?.assignedTo?.name ?? "N/A"} -{" "}
                            {ticket?.responsible?.userName ?? "N/A"}
                          </span>
                          <div className="d-flex justify-content-between mt-5">
                            <div className="d-flex" style={{ gap: "5px" }}>
                              <span
                                className={`badge ${handlePriorityBadgeCOlor(
                                  ticket.priority
                                )}`}
                              >
                                Priority: {ticket.priority}
                              </span>
                              |
                              <span
                                className={`badge ${handleStatusBadgeColor(
                                  ticket.status
                                )}`}
                              >
                                Status: {ticket.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="col-4 ">
                <h4 className="d-flex justify-content-center">In Process</h4>
                {tickets?.items
                  ?.filter(
                    (i) =>
                      i.status === TicketStatus.Pending_Approval ||
                      i.status === TicketStatus.Approved ||
                      i.status === TicketStatus.In_Progress ||
                      i.status === TicketStatus.On_Hold ||
                      i.status === TicketStatus.To_Discuss
                  )
                  ?.map((ticket, idx) => {
                    return (
                      <div
                        className="my-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => onAddTicketClickHandler(ticket)}
                      >
                        <div
                          style={{
                            background: handleTicketColor(ticket.status),
                            border: "none",
                          }}
                          className="card p-3"
                        >
                          <h4>
                            {ticket.title?.substring(0, 20)}
                            {ticket?.title?.length > 20 && "..."}
                          </h4>
                          <div className="d-flex justify-content-between mt-1">
                            <span>
                              {new Date(ticket.createdAt).toLocaleString()}
                            </span>
                            <span className="font-weight-bold">
                              Ticket ID #{ticket?.id}
                            </span>
                          </div>
                          <span className="mt-3 font-weight-bold text-dark">
                            Created By: {ticket?.createdBy?.userName ?? "N/A"}
                          </span>
                          <span className="font-weight-bold text-dark">
                            Assigned To: {ticket?.assignedTo?.name ?? "N/A"} -{" "}
                            {ticket?.responsible?.userName ?? "N/A"}
                          </span>
                          <div className="d-flex justify-content-between mt-5">
                            <div className="d-flex" style={{ gap: "5px" }}>
                              <span
                                className={`badge ${handlePriorityBadgeCOlor(
                                  ticket.priority
                                )}`}
                              >
                                Priority: {ticket.priority}
                              </span>
                              |
                              <span
                                className={`badge ${handleStatusBadgeColor(
                                  ticket.status
                                )}`}
                              >
                                Status: {ticket.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="col-4 ">
                <h4 className="d-flex justify-content-center">Processed</h4>
                {tickets?.items
                  ?.filter(
                    (i) =>
                      i.status === TicketStatus.Resolved ||
                      i.status === TicketStatus.Rejected
                  )
                  ?.map((ticket, idx) => {
                    return (
                      <div
                        className="my-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => onAddTicketClickHandler(ticket)}
                      >
                        <div
                          style={{
                            background: handleTicketColor(ticket.status),
                            border: "none",
                          }}
                          className="card p-3"
                        >
                          <h4>
                            {ticket.title?.substring(0, 20)}
                            {ticket?.title?.length > 20 && "..."}
                          </h4>
                          <div className="d-flex justify-content-between mt-1">
                            <span>
                              {new Date(ticket.createdAt).toLocaleString()}
                            </span>
                            <span className="font-weight-bold">
                              Ticket ID #{ticket?.id}
                            </span>
                          </div>
                          <span className="mt-3 font-weight-bold text-dark">
                            Created By: {ticket?.createdBy?.userName ?? "N/A"}
                          </span>
                          <span className="font-weight-bold text-dark">
                            Assigned To: {ticket?.assignedTo?.name ?? "N/A"} -{" "}
                            {ticket?.responsible?.userName ?? "N/A"}
                          </span>
                          <div className="d-flex justify-content-between mt-5">
                            <div className="d-flex" style={{ gap: "5px" }}>
                              <span
                                className={`badge ${handlePriorityBadgeCOlor(
                                  ticket.priority
                                )}`}
                              >
                                Priority: {ticket.priority}
                              </span>
                              |
                              <span
                                className={`badge ${handleStatusBadgeColor(
                                  ticket.status
                                )}`}
                              >
                                Status: {ticket.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ListTickets;
