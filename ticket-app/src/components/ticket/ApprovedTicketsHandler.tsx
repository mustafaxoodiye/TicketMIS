import { ENDPIONTS, httpService, PaginatedResult } from "@api";
import { useFetch } from "@hooks";
import { User } from "@models";
import {
  ChangeTicketStatusDTO,
  TicketPriorityLevel,
  TicketStatus,
} from "@viewModels";
import { SubmitButton } from "@widgets";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  ticketId: number;
  callback?: () => void;
}

const availableStatuses = ["In_Progress"];

const ApprovedTicketsHandler = ({ ticketId, callback }: Props) => {
  const { register, handleSubmit, errors } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any, e: any) => {
    setIsLoading(true);

    var obj: Partial<ChangeTicketStatusDTO> = {
      id: ticketId,
      status: TicketStatus.In_Progress,
      remarks: data.remarks,
      endDate: data.endDate,
    };

    const res = await httpService(ENDPIONTS.Ticket.changeTicketStatus).update(
      ticketId,
      obj
    );

    callback?.();
    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ overflowX: "hidden" }}>
        <div className="row mt-5">
          <div className="col">
            <div className="form-group">
              <label htmlFor="remarks">remarks</label>
              <textarea
                className="form-control mb-4"
                name="remarks"
                id="remarks"
                aria-label="With textarea"
                ref={register({ required: true })}
              ></textarea>
              <span className="text-danger">
                {errors.remarks && <span>This field is required</span>}
              </span>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="col-5">
            <div className="form-group">
              <label>Due Date</label>
              <div className="col-12">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Enter Due Date"
                  name="endDate"
                  ref={register({ required: true })}
                />
              </div>
            </div>
          </div>
          {/* <div className="col-5">
            <div className="form-group">
              <label>Ticket Status</label>
              <select
                className="form-control select"
                name="status"
                ref={register({ required: true })}
              >
                <option></option>
                {Object.keys(TicketStatus)
                  .filter((f) => availableStatuses.includes(f))
                  .map((d, i) => (
                    <option key={i} value={d}>
                      {d.replace("_", " ")}
                    </option>
                  ))}
              </select>
            </div>
          </div> */}
          <div className="col-auto mt-3">
            <SubmitButton isLoading={isLoading} />
          </div>
        </div>
      </form>
    </>
  );
};

export default ApprovedTicketsHandler;
