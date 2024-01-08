import { ENDPIONTS, getUserInfo, httpService, logout } from "@api";
import { ListTickets, Unauthorized } from "@components";
import { useFetch } from "@hooks";
import { Dashboard, Header, Sidebar } from "@layout";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import "@pathofdev/react-tag-input/build/index.css";

function App() {
  var currentUser = getUserInfo();

  useFetch<null>({ endPoint: ENDPIONTS.User.checkSession }, null);
  const [connectionM, setconnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5079/realtime", {
        withCredentials: true,
        accessTokenFactory: () => currentUser.token,
      })
      .build();

    setconnection(connection);

    connection.on("send", (data) => {
      console.log(data);
    });

    connection.on("sayHi", (d) => {
      // alert(d);
      logout();
    });

    connection.start().then(() => {
      httpService(ENDPIONTS.User.checkSession).getAll();
    });
  }, []);

  return (
    <>
      <Header />

      <div className="main-container" id="container">
        <div className="overlay" />
        <div className="search-overlay" />

        <Sidebar />
        <div id="content" className="main-content">
          <Routes>
            <Route path="/tickets/:status" element={<ListTickets />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
