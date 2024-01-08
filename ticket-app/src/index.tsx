import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserHistory } from "history";
import AppRoutes from "./Routes";
import { HubConnectionBuilder } from "@microsoft/signalr";

const history = createBrowserHistory();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <AppRoutes history={history} />
  // </React.StrictMode>
);
