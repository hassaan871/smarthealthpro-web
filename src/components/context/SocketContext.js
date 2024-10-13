import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const socketInitialized = useRef(false);

  const connectSocket = useCallback(async () => {
    if (socketRef.current) {
      console.log("Socket already exists, not creating a new one.");
      return;
    }

    try {
      const userId = await localStorage.getItem("userToken");
      if (userId) {
        const newSocket = io("http://192.168.72.155:5000", {
          query: { userId: userId },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
          console.log("Connected to the socket server");
          setError(null);
        });

        newSocket.on("connect_error", (err) => {
          console.error("Connection error: ", err);
          setError("Failed to connect to the server");
        });

        newSocket.on("disconnect", (reason) => {
          console.warn("Disconnected from the socket server: ", reason);
        });

        newSocket.on("reconnect_attempt", () => {
          console.log("Attempting to reconnect...");
        });

        setSocket(newSocket);
        socketRef.current = newSocket;
      } else {
        console.warn("No userToken found in localStorage");
        setError("No user token found. Unable to connect to the server.");
      }
    } catch (err) {
      console.error("Error initializing socket: ", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  }, []);

  useEffect(() => {
    if (!socketInitialized.current) {
      connectSocket();
      socketInitialized.current = true;
    }

    return () => {
      if (socketRef.current) {
        console.log("Socket connection closed");
        socketRef.current.close();
        socketRef.current = null;
        socketInitialized.current = false;
      }
    };
  }, [connectSocket]);

  const value = {
    socket,
    error,
    connectSocket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
