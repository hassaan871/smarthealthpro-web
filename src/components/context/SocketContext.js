import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [loading, user]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting socket");

      // Remove all listeners to prevent memory leaks
      socketRef.current.removeAllListeners();

      // Close the connection
      socketRef.current.close();

      // Reset state and refs
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setError(null);
    }
  }, []);

  const connectSocket = useCallback(async () => {
    if (socketRef.current) {
      console.log("Socket already exists, not creating a new one.");
      return;
    }

    try {
      const newSocket = io("https://localhost:5000", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
      });

      // Connection event handlers
      newSocket.on("connect", () => {
        console.log("Socket connected successfully:", newSocket.id);
        setIsConnected(true);
        setError(null);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setError("Failed to connect to the server");
        setIsConnected(false);
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason);
        setIsConnected(false);
        if (reason === "io server disconnect") {
          // Server disconnected the socket, try to reconnect
          setTimeout(() => {
            connectSocket();
          }, 1000);
        }
      });

      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Attempting to reconnect... (Attempt ${attemptNumber})`);
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log(`Reconnected after ${attemptNumber} attempts`);
        setIsConnected(true);
        setError(null);
      });

      newSocket.on("reconnect_error", (error) => {
        console.error("Reconnection error:", error);
        setError("Failed to reconnect to the server");
      });

      newSocket.on("reconnect_failed", () => {
        console.error("Failed to reconnect after all attempts");
        setError("Failed to reconnect after multiple attempts");
      });

      newSocket.on("error", (error) => {
        if (error === "Authentication error") {
          setError("Authentication failed. Please login again.");
          disconnectSocket();
        }
      });

      // Set socket in state and ref
      setSocket(newSocket);
      socketRef.current = newSocket;
    } catch (err) {
      console.error("Error initializing socket:", err);
      setError("An unexpected error occurred while connecting to the server");
      setIsConnected(false);
    }
  }, []);

  const joinRoom = useCallback(
    (roomId) => {
      if (!socketRef.current || !isConnected) {
        console.warn("Cannot join room: socket not connected");
        return;
      }

      console.log("Joining room:", roomId);
      socketRef.current.emit("joinRoom", roomId);
    },
    [isConnected]
  );

  const leaveRoom = useCallback(
    (roomId) => {
      if (!socketRef.current || !isConnected) {
        console.warn("Cannot leave room: socket not connected");
        return;
      }

      console.log("Leaving room:", roomId);
      socketRef.current.emit("leaveRoom", roomId);
    },
    [isConnected]
  );

  // Context value
  const value = {
    socket,
    error,
    isConnected,
    connectSocket,
    disconnectSocket,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// Custom hook for socket events
export const useSocketEvent = (eventName, callback) => {
  const { socket, isConnected } = useSocketContext();

  React.useEffect(() => {
    if (!socket || !isConnected) return;

    // Add event listener
    socket.on(eventName, callback);

    // Cleanup
    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, isConnected, eventName, callback]);
};
