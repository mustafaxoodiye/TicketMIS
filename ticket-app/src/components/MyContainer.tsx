import React from "react";
import { Helmet } from "react-helmet";

interface Props {
  children: React.ReactNode;
  title?: string;
  head?: string;
  size?: string;
}

const MyContainer: React.FC<Props> = ({ children, title, head, size }) => {
  return (
    <div className={size ?? "layout-px-spacing"}>
      <div className="page-header">
        <div className="page-title">
          <h4>{head}</h4>
        </div>
      </div>
      <div className="row layout-spacing">
        <div className="col-xl-12 col-lg-6 col-md-5 col-sm-12 layout-top-spacing">
          <div className="skills layout-spacing ">
            <div className="widget-content widget-content-area">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyContainer;
