import { TicketRevision } from "@models";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

interface Props {
  ticketRevissions: TicketRevision[];
}

const TicketRevissions = ({ ticketRevissions }: Props) => {
  useEffect(() => {
    return () => {
      ticketRevissions = [];
    };
  }, [ticketRevissions]);

  return (
    <>
      <Helmet>
        {/* BEGIN PAGE LEVEL PLUGINS/CUSTOM STYLES */}
        <link
          href="/plugins/apex/apexcharts.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/assets/css/dashboard/dash_1.css"
          rel="stylesheet"
          type="text/css"
        />
        <script defer src="/plugins/apex/apexcharts.min.js"></script>
        <script defer src="/assets/js/dashboard/dash_1.js"></script>
        {/* END PAGE LEVEL PLUGINS/CUSTOM STYLES */}
      </Helmet>

      <div className="col-12">
        <h5 className="d-flex justify-content-start">Ticket Revissions</h5>
        <div className="col-12 widget-activity-four">
          <div className="timeline-line">
            {ticketRevissions?.map((revission: TicketRevision, idx) => {
              return (
                <div className="item-timeline timeline-dark">
                  <div className="t-dot" data-original-title></div>
                  <div className="t-text">
                    <div className="row">
                      <p className="col-12 text-left">
                        <span className="font-weight-bold">
                          By: {revission?.createdBy?.userName}
                        </span>{" "}
                        <small
                          className={`badge badge-dark`}
                          style={{ fontSize: "9px" }}
                        >
                          {revission?.status}
                        </small>
                      </p>
                      <p className="col-12 text-left ml-3">
                        <span className="font-weight-bold">Remarks:</span>{" "}
                        {revission?.remarks} ,{" "}
                      </p>
                    </div>
                    {/* <span className="badge badge-primary">Issued</span> */}
                    <p className="t-time">
                      {new Date(revission?.createdAt ?? "").toDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketRevissions;
