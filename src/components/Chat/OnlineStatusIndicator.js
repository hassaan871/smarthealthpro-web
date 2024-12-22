import React, { useState, useEffect, useContext } from "react";
import { useSocketContext } from "../../components/context/SocketContext";
import Context from "../context/context";

const OnlineStatusIndicator = ({ userId }) => {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useSocketContext();
  const { userInfo } = useContext(Context);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("checkOnlineStatus", userId);

    const handleUserStatus = (data) => {
      if (data.userId === userId) {
        setIsOnline(data.isOnline);
      }
    };

    socket.on("userStatus", handleUserStatus);

    return () => {
      socket.off("userStatus", handleUserStatus);
    };
  }, [socket, userId]);

  return (
    <div className="online-status-indicator">
      <div className={`status-dot ${isOnline ? "online" : "offline"}`} />
      <span>{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
};

export default OnlineStatusIndicator;
