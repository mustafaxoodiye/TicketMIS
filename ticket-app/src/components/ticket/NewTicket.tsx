import { ENDPIONTS, getUserInfo, httpService } from "@api";
import {
  ApprovedTicketsHandler,
  AssignedTicketsHandler,
  InProgressTicketsHandler,
  NewTicketsHandler,
  TextEditor,
  TicketRevissions,
} from "@components";
import { useFetch } from "@hooks";
import { Ticket, TicketRevision } from "@models";
import { TicketPriorityLevel, TicketStatus } from "@viewModels";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";

interface Props {
  callback?: () => void;
  ticket?: Ticket;
  tStatus?: TicketStatus;
}

const NewTicket = ({ callback, ticket, tStatus }: Props) => {
  var currentUser = getUserInfo();

  const { register, handleSubmit, errors } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [readOnlyQuil, setReadOnlyQuil] = useState<boolean | null>(null);
  const [ticketPriority, setTicketPriority] =
    useState<TicketPriorityLevel | null>(ticket ? ticket.priority : null);
  const [ticketRevissions, setTicketRevissions] = useState<TicketRevision[]>(
    []
  );
  const textEditor = useRef("");

  useEffect(() => {
    if (ticket?.description) textEditor.current = ticket.description;

    if (ticket?.id) {
      (async function () {
        var res = await httpService<TicketRevision[]>(
          ENDPIONTS.Ticket.TicketRevisions
        ).getById(ticket.id);
        if (res.status === 200) {
          setTicketRevissions(res.data);
          if (res?.data.length > 0 || tStatus) {
            setReadOnlyQuil(true);
          } else {
            setReadOnlyQuil(false);
          }
        }
      })();
    } else {
      setReadOnlyQuil(false);
    }
  }, [ticket, tStatus]);

  const onSubmit = async (data: any, e: any) => {
    setErrMsg("");
    if (!textEditor.current) {
      setErrMsg("Please refresh your page and try again.");
      return;
    }
    setIsLoading(true);

    const newTicket: Partial<Ticket> = {
      title: data.title,
      description: textEditor.current,
      priority: data.priority,
    };

    let res;
    if (ticket?.id) {
      newTicket.id = ticket.id;
      delete newTicket.priority;

      res = await httpService(ENDPIONTS.Ticket.tickets).update(
        ticket.id,
        newTicket
      );
    } else {
      res = await httpService(ENDPIONTS.Ticket.tickets).post(newTicket);
    }

    if (res.status === 201 || res.status === 204) {
      callback?.();
      e.target.reset();
      textEditor.current = "";
    }

    setIsLoading(false);
  };

  const onEditorChange = (val: string) => {
    textEditor.current = val;
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <h4>{!tStatus ? "New Ticket" : "Ticket Info"}</h4>
      <hr />

      <div className="row">
        <div className="col-7">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <div className="col d-flex justify-content-start">
                {errMsg && <small className="text-danger">* {errMsg}</small>}
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Title</label>
                  <div className="col-12">
                    <input
                      disabled={readOnlyQuil === true ? true : false}
                      type="text"
                      defaultValue={ticket?.title ?? ""}
                      className="form-control"
                      placeholder="Enter title"
                      name="title"
                      ref={register({ required: true })}
                    />
                  </div>
                </div>
              </div>
              {(!ticket ||
                tStatus === TicketStatus.New.capitalize() ||
                tStatus === TicketStatus.Pending_Approval.capitalize()) && (
                <div className="col">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      className="form-control select"
                      name="priority"
                      ref={register({ required: true })}
                      onChange={(e) =>
                        setTicketPriority(e.target.value as TicketPriorityLevel)
                      }
                    >
                      {/* <option></option> */}
                      {Object.keys(TicketPriorityLevel).map((d, i) => (
                        <option
                          key={i}
                          value={d}
                          selected={ticket?.priority === d.toLowerCase()}
                        >
                          {d.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                height: "100%",
                flex: "1",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {readOnlyQuil && (
                <h5 className="d-flex justify-content-start mt-3">
                  Issue Description:
                </h5>
              )}
              {readOnlyQuil !== null && (
                <TextEditor
                  readOnly={readOnlyQuil}
                  text={ticket?.description ?? ""}
                  callback={onEditorChange}
                />
              )}
            </div>

            {!readOnlyQuil && (
              <div className="mt-5 d-flex justify-content-end">
                <input
                  type="submit"
                  name="time"
                  className="btn btn-primary"
                  disabled={isLoading}
                  value={
                    isLoading
                      ? "Please wait..."
                      : ticket
                      ? "Update"
                      : "Register"
                  }
                />
              </div>
            )}
          </form>
        </div>
        <div className="col-auto">
          {ticketRevissions?.length > 0 && (
            <div className="row">
              <TicketRevissions ticketRevissions={ticketRevissions} />
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-7">
          <hr />

          {ticket && tStatus === TicketStatus.New.capitalize() && (
            <NewTicketsHandler
              ticketId={ticket.id}
              selectedPriorityLevel={ticketPriority!}
              callback={callback}
            />
          )}

          {ticket && tStatus === TicketStatus.Pending_Approval.capitalize() && (
            <AssignedTicketsHandler
              ticketId={ticket.id}
              selectedPriorityLevel={ticketPriority!}
              callback={callback}
            />
          )}

          {ticket && tStatus === TicketStatus.Approved.capitalize() && (
            <ApprovedTicketsHandler ticketId={ticket.id} callback={callback} />
          )}

          {/* When marking the ticket as resolved, only the user who took the responsibility can mark it as so. */}
          {ticket &&
            tStatus === TicketStatus.In_Progress.capitalize() &&
            ticket.responsibleId === +currentUser.userId && (
              <InProgressTicketsHandler
                ticketId={ticket.id}
                callback={callback}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
