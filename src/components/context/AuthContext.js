// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/me", { withCredentials: true });
      if (res.status === 200 && res.data.user) {
        setUser(res.data.user);
        // console.log("✅ User session restored:", res.data.user);
      } else {
        setUser(null);
        console.warn("⚠️ /me returned 200 but no user data");
      }
    } catch (err) {
      setUser(null);
      if (err.response?.status === 401) {
        console.warn("🔁 Session expired or invalid. User must login.");
      } else {
        console.error("❌ Unexpected error during session check:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // On mount, call /me to check session and trigger silent refresh if needed (backend handles refresh token)
  useEffect(() => {
    checkSession();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
