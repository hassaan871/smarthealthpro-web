// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SocketContextProvider } from "./components/context/SocketContext";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider, useAuth } from "./components/context/AuthContext";

// Wrapper to wait for auth check before rendering routes
const AuthenticatedApp = () => {
  const { loading } = useAuth();

  if (loading) {
    return null; // or <Spinner />
  }

  return <AppRoutes />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketContextProvider>
          <AuthenticatedApp /> {/* 💡 Only render routes after /me check */}
        </SocketContextProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
