// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { MyContextProvider } from "./components/context/context";
import { SocketContextProvider } from "./components/context/SocketContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <MyContextProvider>
      <SocketContextProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SocketContextProvider>
    </MyContextProvider>
  );
}

export default App;
