import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSocketContext } from "../../components/context/SocketContext";
import { FiSearch, FiSend, FiPaperclip, FiX, FiFileText } from "react-icons/fi";
import "./ChatScreen.css";
import { encrypt, decrypt } from "../../encrypt/Encrypt";
import { debounce } from "lodash";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../../api/axiosInstance";

// Online Status Dot Component
const OnlineStatusDot = ({ isOnline }) => (
  <span
    className={`online-dot${isOnline ? "" : " offline"}`}
    title={isOnline ? "Online" : "Offline"}
  />
);

// Add global online user state
// const [onlineMap, setOnlineMap] = useState({}); // This line is removed

// Listen for userStatus and onlineUsers events globally
// useEffect(() => { // This block is removed
//   if (!socket) return;

//   const handleUserStatus = ({ userId, isOnline }) => {
//     setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
//   };

//   const handleOnlineUsers = (userIds) => {
//     setOnlineMap((prev) => {
//       const newMap = { ...prev };
//       // Set all users in the list as online, others as offline
//       Object.keys(newMap).forEach((id) => {
//         newMap[id] = false;
//       });
//       userIds.forEach((id) => {
//         newMap[id] = true;
//       });
//       return newMap;
//     });
//   };

//   socket.on("userStatus", handleUserStatus);
//   socket.on("onlineUsers", handleOnlineUsers);

//   return () => {
//     socket.off("userStatus", handleUserStatus);
//     socket.off("onlineUsers", handleOnlineUsers);
//   };
// }, [socket]); // This line is removed

// Update OnlineStatusIndicator to use onlineMap
const OnlineStatusIndicator = ({ userId, showText, onlineMap }) => {
  const isOnline = onlineMap[userId] || false;
  return (
    <span className="header-status-indicator">
      <OnlineStatusDot isOnline={isOnline} />
      {showText && (
        <span className="header-status-text">
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
    </span>
  );
};

// Memoized Details Sidebar
const DetailsSidebar = ({ isOpen, onClose, selectedConversation }) => {
  const [activeTab, setActiveTab] = useState("none");
  const [loadingStates, setLoadingStates] = useState({
    summary: false,
    notes: false,
    prescriptions: false,
  });
  const [data, setData] = useState({
    summaries: [],
    notes: [],
    prescriptions: [],
  });
  const { user } = useAuth();

  const setLoadingFor = useCallback((tab, isLoading) => {
    setLoadingStates((prev) => ({ ...prev, [tab]: isLoading }));
  }, []);

  const fetchData = useCallback(
    async (tab) => {
      if (!selectedConversation?.participants[1]) return;

      try {
        setLoadingFor(tab, true);
        const patientIDIndex = selectedConversation.participants.findIndex(
          (id) => id !== user._id
        );
        const patientID = selectedConversation.participants[patientIDIndex];

        let response;
        switch (tab) {
          case "summary":
            response = await api.get(`/user/getSummaries/${patientID}`);
            setData((prev) => ({ ...prev, summaries: response.data }));
            break;
          case "notes":
            response = await api.get(`/user/getMatchingNotes`, {
              params: { patientId: patientID },
            });
            const decryptedNotes = response.data.notes.map((note) => ({
              ...note,
              note: decrypt(note.note),
            }));
            setData((prev) => ({ ...prev, notes: decryptedNotes }));
            break;
          case "prescriptions":
            response = await fetch(`/appointment/${patientID}/prescription`);
            const prescriptionData = await response.json();
            const decryptedPrescriptions = prescriptionData.data.map(
              (record) => ({
                ...record,
                prescriptions: record.prescriptions.map((prescription) => ({
                  ...prescription,
                  medication: decrypt(prescription.medication),
                  dosage: decrypt(prescription.dosage),
                  frequency: decrypt(prescription.frequency),
                  duration: decrypt(prescription.duration),
                  instructions: decrypt(prescription.instructions),
                })),
              })
            );
            setData((prev) => ({
              ...prev,
              prescriptions: decryptedPrescriptions,
            }));
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${tab}:`, error);
        setData((prev) => ({ ...prev, [tab]: [] }));
      } finally {
        setLoadingFor(tab, false);
      }
    },
    [selectedConversation, user._id, setLoadingFor]
  );

  useEffect(() => {
    if (selectedConversation?.participants[1]) {
      fetchData(activeTab);
    }
  }, [selectedConversation, activeTab, fetchData]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const renderContent = useMemo(() => {
    if (loadingStates[activeTab]) {
      return (
        <div className="loading-state">
          <div className="loader-container">
            <div className="loader"></div>
            <div className="loader-text">Loading...</div>
          </div>
        </div>
      );
    }

    const renderItems = (items, type) => {
      if (!items?.length) {
        return <div className="empty-state">No {type} available</div>;
      }

      return items.map((item, index) => (
        <div key={index} className={`${type}-item`}>
          <div className="item-header">
            <span className="item-type">
              {type === "summaries"
                ? "Summary"
                : type === "notes"
                ? "Clinical Note"
                : "Prescription"}
            </span>
            <span className="item-date">
              {formatDate(item.createdAt || item.date)}
            </span>
          </div>
          <div className="item-content">
            {type === "summaries" && item.summary}
            {type === "notes" && item.note}
            {type === "prescriptions" && (
              <div className="prescription-content">
                <div className="medicine-name">{item.medication}</div>
                <div className="medicine-details">
                  <div>Dosage: {item.dosage}</div>
                  <div>Frequency: {item.frequency}</div>
                  <div>Duration: {item.duration}</div>
                  <div>Instructions: {item.instructions}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ));
    };

    switch (activeTab) {
      case "summary":
        return (
          <div className="summaries-list">
            {renderItems(data.summaries, "summaries")}
          </div>
        );
      case "notes":
        return (
          <div className="notes-list">{renderItems(data.notes, "notes")}</div>
        );
      case "prescriptions":
        const flatPrescriptions = data.prescriptions.flatMap((appointment) =>
          appointment.prescriptions.map((prescription) => ({
            ...prescription,
            date: appointment.date,
          }))
        );
        return (
          <div className="prescriptions-list">
            {renderItems(flatPrescriptions, "prescriptions")}
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, loadingStates, data, formatDate]);

  return (
    <div className={`details-sidebar ${isOpen ? "open" : ""}`}>
      <div className="details-content">
        <div className="tabs-header">
          {["summary", "notes", "prescriptions"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <div className="sidebar-header">
            <button onClick={onClose} className="close-sidebar-btn">
              <FiX />
            </button>
          </div>
        </div>
        <div className="tab-content">{renderContent}</div>
      </div>
    </div>
  );
};

// Main ChatScreen Component
const ChatScreen = () => {
  // State management
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [onlineMap, setOnlineMap] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef(null);

  // Refs and context
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { socket, connectSocket, disconnectSocket, joinRoom, isConnected } =
    useSocketContext();
  const location = useLocation();

  // Debug: Log when ChatScreen mounts
  // console.log("[ChatScreen] Rendered. User:", user);

  // Move this to the top, before any useEffect or other usage!
  const currentMessages = selectedConversation
    ? messagesByConversation[selectedConversation._id] || []
    : [];

  const getDateLabel = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(messageDate, today)) return "Today";
    if (isSameDay(messageDate, yesterday)) return "Yesterday";

    const diffInDays = Math.floor(
      (today - messageDate) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 7) {
      return messageDate.toLocaleDateString("en-US", { weekday: "long" });
    }

    return messageDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Navigation state
  const incomingConversation = location.state?.conversation;
  const incomingPatient = location.state?.patient;

  // Memoized decryption function
  const decryptMessage = useCallback((msg) => {
    try {
      return {
        ...msg,
        content: msg.fileInfo
          ? msg.content
          : decrypt(msg.content) || "Decryption failed",
        fileInfo: msg.fileInfo
          ? {
              ...msg.fileInfo,
              originalName:
                decrypt(msg.fileInfo.originalName) || "Unknown file",
              url: decrypt(msg.fileInfo.url) || "",
            }
          : null,
      };
    } catch (error) {
      console.error("Error decrypting message:", error);
      return {
        ...msg,
        content: "Decryption failed",
        fileInfo: msg.fileInfo
          ? { ...msg.fileInfo, originalName: "Unknown file", url: "" }
          : null,
      };
    }
  }, []);

  // Optimized fetch functions
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setFetchError("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await api.get("/conversations");
      setConversations(response.data);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setFetchError("Failed to load conversations. Please try again later.");
    }
  }, [user]);

  // Update fetchMessages to merge backend and socket messages
  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return [];
      try {
        setLoading(true);
        const response = await api.get(
          `/conversations/${conversationId}/messages`
        );
        const decryptedMessages = response.data.map((msg) => ({
          ...decryptMessage(msg),
          readStatus: msg.readStatus || { [user._id]: true },
        }));
        setMessagesByConversation((prev) => {
          const socketMsgs = prev[conversationId] || [];
          // Merge, avoiding duplicates
          const allMsgs = [...decryptedMessages];
          socketMsgs.forEach((msg) => {
            if (!allMsgs.some((m) => m._id === msg._id)) allMsgs.push(msg);
          });
          return {
            ...prev,
            [conversationId]: allMsgs,
          };
        });
        return decryptedMessages;
      } catch (error) {
        console.error("Error fetching messages:", error);
        setFetchError("Failed to load messages. Please try again later.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [decryptMessage, user._id]
  );

  // --- Bulletproof socket event handlers ---
  const handleNewMessage = useCallback(
    (data) => {
      console.log("Received new message:", data);
      const decryptedMessage = decryptMessage(data);
      setMessagesByConversation((prevMessages) => {
        const convId = decryptedMessage.conversationId;
        const convMessages = prevMessages[convId] || [];
        if (convMessages.some((msg) => msg._id === decryptedMessage._id)) {
          return prevMessages;
        }
        return {
          ...prevMessages,
          [convId]: [...convMessages, decryptedMessage],
        };
      });
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv._id === decryptedMessage.conversationId
            ? {
                ...conv,
                lastMessage: decryptedMessage.content,
                updatedAt: decryptedMessage.timestamp,
              }
            : conv
        )
      );
    },
    [decryptMessage]
  );

  const handleTyping = useCallback((data) => {
    // Implement your typing indicator logic here
    // Example: setTypingUsers((prev) => ({ ...prev, [data.userId]: true }));
    // You may need to add typingUsers state if not present
  }, []);

  const handleStopTyping = useCallback((data) => {
    // Implement your stop typing indicator logic here
    // Example: setTypingUsers((prev) => { const updated = { ...prev }; delete updated[data.userId]; return updated; });
  }, []);

  const handleMessageRead = useCallback((data) => {
    setMessagesByConversation((prev) =>
      Object.keys(prev).reduce((acc, convId) => {
        const convMsgs = prev[convId] || [];
        return {
          ...acc,
          [convId]: convMsgs.map((msg) =>
            msg._id === data.messageId
              ? {
                  ...msg,
                  readStatus: { ...msg.readStatus, [data.userId]: true },
                }
              : msg
          ),
        };
      }, {})
    );
  }, []);

  useEffect(() => {
    if (!socket) return;
    console.log("Attaching socket listeners");
    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("messageRead", handleMessageRead);
    return () => {
      console.log("Detaching socket listeners");
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("messageRead", handleMessageRead);
    };
  }, [
    socket,
    handleNewMessage,
    handleTyping,
    handleStopTyping,
    handleMessageRead,
  ]);

  // Socket connection management
  useEffect(() => {
    if (!user?._id) return;

    connectSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id, connectSocket, disconnectSocket]);

  useEffect(() => {
    if (!socket) return;

    const handleUserStatus = ({ userId, isOnline }) => {
      console.log("[Socket] userStatus event:", userId, isOnline);
      setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
    };

    const handleOnlineUsers = (userIds) => {
      console.log("[Socket] onlineUsers event:", userIds);
      setOnlineMap((prev) => {
        const newMap = { ...prev };
        Object.keys(newMap).forEach((id) => {
          newMap[id] = false;
        });
        userIds.forEach((id) => {
          newMap[id] = true;
        });
        return newMap;
      });
    };

    socket.on("userStatus", handleUserStatus);
    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("userStatus", handleUserStatus);
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedConversation?._id || !user) return;

    const markMessagesAsRead = async () => {
      try {
        const conversationId = selectedConversation._id;

        // 1. Mark messages as read in DB
        await api.post(`/conversations/${conversationId}/mark-messages-read`, {
          conversationId,
        });

        // 2. Reset unread count
        await api.post(`/conversations/${conversationId}/read`);

        // 3. Emit "messageRead" for unread messages
        if (socket?.connected) {
          const unreadMessages = messagesByConversation[conversationId]?.filter(
            (msg) =>
              msg.sender !== user._id &&
              (!msg.readStatus || !msg.readStatus[user._id])
          );

          unreadMessages.forEach((msg) => {
            socket.emit("messageRead", {
              messageId: msg._id,
              conversationId,
              userId: user._id,
            });
          });
        }
      } catch (error) {
        console.error("🔴 Error marking messages as read:", error);
      }
    };

    markMessagesAsRead();
  }, [selectedConversation?._id, user._id, socket, messagesByConversation]);

  // Room management
  useEffect(() => {
    if (selectedConversation?._id && isConnected) {
      joinRoom(selectedConversation._id);
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation?._id, isConnected, joinRoom, fetchMessages]);

  // Initial data loading
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle incoming conversation
  useEffect(() => {
    if (incomingConversation) {
      setSelectedConversation(incomingConversation);
      if (incomingConversation._id) {
        fetchMessages(incomingConversation._id);
      }
    }
  }, [incomingConversation, fetchMessages]);

  // Auto-scroll to bottom only if user is near the bottom or a new message is sent by the user
  useEffect(() => {
    const container = messagesEndRef.current?.parentNode;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // If the last message is sent by the user, always scroll
    else if (
      currentMessages.length &&
      currentMessages[currentMessages.length - 1].sender === user._id
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // Otherwise, do not auto-scroll (user is reading history)
  }, [currentMessages, user._id]);

  // Always scroll to bottom when messages for the selected conversation are loaded or change
  useEffect(() => {
    if (!selectedConversation?._id) return;
    if (currentMessages.length > 0) {
      // Scroll immediately
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      // Scroll after a short delay
      const timeout1 = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);

      // Scroll after a longer delay
      const timeout2 = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);

      // Clean up
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [selectedConversation?._id, currentMessages.length]);

  // Auto-scroll to bottom when typing indicator appears (typingUsers changes)
  useEffect(() => {
    if (!selectedConversation?._id) return;
    if (Object.keys(typingUsers).length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 30);
    }
  }, [typingUsers, selectedConversation?._id]);

  // Message sending
  const createNewConversation = useCallback(
    async (firstMessage) => {
      try {
        const response = await api.post("/conversations", {
          otherUserId: incomingPatient.id,
        });

        const newConversation = response.data;
        setSelectedConversation(newConversation);

        if (socket?.connected) {
          socket.emit("joinRoom", newConversation._id);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const messageData = {
          conversationId: newConversation._id,
          sender: user._id,
          content: encrypt(firstMessage),
          timestamp: new Date(),
        };

        const messageResponse = await api.post(
          `/conversations/${newConversation._id}/messages`,
          messageData
        );

        await api.put(`/conversations/${newConversation._id}/lastMessage`, {
          lastMessage: firstMessage,
        });

        if (socket?.connected) {
          socket.emit("sendMessage", {
            newMessage: messageResponse.data,
            conversationId: newConversation._id,
          });
        }

        setConversations((prev) => [newConversation, ...prev]);
        setNewMessage("");

        return newConversation;
      } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }
    },
    [incomingPatient, socket, user._id]
  );

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    const tempId = Date.now().toString(); // Temporary ID
    const timestamp = new Date();
    const messagePayload = {
      _id: tempId,
      content: newMessage,
      sender: user._id,
      timestamp,
      status: "sending",
    };

    // Optimistically add message to UI
    setMessagesByConversation((prev) => {
      const convId = selectedConversation?._id;
      if (!convId) return prev;
      const prevMsgs = prev[convId] || [];
      if (prevMsgs.some((msg) => msg._id === tempId)) return prev;
      return {
        ...prev,
        [convId]: [...prevMsgs, messagePayload],
      };
    });
    setNewMessage("");

    try {
      let conversationToUse = selectedConversation;

      // Create conversation if doesn't exist yet
      if (!conversationToUse && incomingPatient) {
        conversationToUse = await createNewConversation(newMessage);
      }

      const payload = {
        conversationId: conversationToUse._id, // backend needs this
        sender: user._id,
        content: encrypt(newMessage),
        timestamp,
      };

      const response = await api.post(
        `/conversations/${conversationToUse._id}/sendMessageAtomic`,
        payload
      );

      // Emit socket event for real-time update
      if (socket?.connected) {
        socket.emit("sendMessage", {
          newMessage: response.data,
          conversationId: conversationToUse._id,
        });
      }

      // Replace temporary message with server-confirmed message
      setMessagesByConversation((prev) => {
        const convId = selectedConversation?._id;
        if (!convId) return prev;
        return {
          ...prev,
          [convId]: prev[convId]?.map((msg) =>
            msg._id === tempId
              ? { ...decryptMessage(response.data), status: "sent" }
              : msg
          ),
        };
      });
    } catch (err) {
      console.error("Message send failed", err);

      // Mark message as failed so UI can reflect retry option or failure
      setMessagesByConversation((prev) => {
        const convId = selectedConversation?._id;
        if (!convId) return prev;
        return {
          ...prev,
          [convId]: prev[convId]?.map((msg) =>
            msg._id === tempId ? { ...msg, status: "failed" } : msg
          ),
        };
      });
    }
  }, [
    newMessage,
    selectedConversation,
    incomingPatient,
    createNewConversation,
    decryptMessage,
    user._id,
    socket,
  ]);

  const retryMessage = async (failedMessage) => {
    setNewMessage(failedMessage.content); // Prefill input with failed content
  };

  const debouncedSendMessage = useCallback(
    debounce(sendMessage, 300, { leading: true, trailing: false }),
    [sendMessage]
  );

  // File upload
  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (
        !file ||
        (!selectedConversation && !incomingPatient) ||
        !socket?.connected
      )
        return;

      let conversationToUse = selectedConversation;

      try {
        // 1. Upload file to server
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // 2. If conversation doesn't exist, create it first
        if (!conversationToUse && incomingPatient) {
          conversationToUse = await createNewConversation("File shared");
        }

        // 3. Prepare fileInfo for message
        const uploadedFile = uploadResponse.data.file;
        const fileInfo = {
          ...uploadedFile,
          originalName: encrypt(uploadedFile.originalName),
          url: encrypt(uploadedFile.url),
        };

        // 4. Send file message using atomic endpoint
        const messageData = {
          conversationId: conversationToUse._id,
          sender: user._id,
          fileInfo,
        };

        const response = await api.post(
          `/conversations/${conversationToUse._id}/sendMessageAtomic`,
          messageData
        );

        // 5. Emit socket event for real-time update
        if (socket.connected) {
          socket.emit("sendMessage", {
            newMessage: response.data,
            conversationId: conversationToUse._id,
          });
        }

        // 6. Optionally update lastMessage in conversation list (already handled by backend)
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      }
    },
    [
      selectedConversation,
      incomingPatient,
      socket,
      user._id,
      createNewConversation,
    ]
  );

  // Utility functions
  const formatTime = useCallback((time) => {
    return new Date(time).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }, []);

  const getOtherUserName = useCallback(
    (conversation) => {
      if (!conversation?.name || !user._id) return "Unknown";
      const otherUserIndex = conversation.participants.findIndex(
        (id) => id !== user._id
      );
      return conversation.name[otherUserIndex] || "Unknown";
    },
    [user._id]
  );

  const getOtherUserAvatar = useCallback(
    (conversation) => {
      if (!conversation?.avatar || !user._id) return "default-avatar.png";
      const otherUserIndex = conversation.participants.findIndex(
        (id) => id !== user._id
      );
      const avatar = conversation.avatar[otherUserIndex];
      return avatar?.url?.length > 0 ? avatar.url : avatar;
    },
    [user._id]
  );

  const handleFileClick = useCallback((fileInfo) => {
    if (!fileInfo?.url) return;
    // Use url and originalName as-is, do NOT decrypt again
    const url = fileInfo.url;
    const originalName = fileInfo.originalName;

    if (fileInfo.mimetype === "application/pdf") {
      window.open(url, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  // When a conversation is selected, clear its unread count for the current user in the UI
  const handleSelectConversation = async (conv) => {
    // Clear unread count visually for the current user
    setConversations((prevConvs) =>
      prevConvs.map((c) => {
        if (c._id === conv._id) {
          // If unreadCount is a number, set to 0. If it's an object, set for current user.
          if (typeof c.unreadCount === "number") {
            return { ...c, unreadCount: 0 };
          } else if (c.unreadCount && user?._id) {
            return {
              ...c,
              unreadCount: { ...c.unreadCount, [user._id]: 0 },
            };
          }
        }
        return c;
      })
    );
    // Fetch and merge messages, then set selectedConversation
    await fetchMessages(conv._id);
    setSelectedConversation(conv);
  };

  // Memoized filtered conversations
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conv) =>
        getOtherUserName(conv).toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [conversations, searchQuery, getOtherUserName]
  );

  // Render functions
  const renderConversationItem = useCallback(
    (conv) => {
      const unreadCount =
        typeof conv.unreadCount === "number"
          ? conv.unreadCount
          : conv.unreadCount && user?._id
          ? conv.unreadCount[user._id]
          : 0;

      return (
        <div
          key={conv._id}
          className={`conversation-item bg-gray-800 hover:bg-gray-700 ${
            selectedConversation?._id === conv._id ? "bg-gray-700" : ""
          }`}
          onClick={async () => await handleSelectConversation(conv)}
          style={{ position: "relative" }}
        >
          <img
            src={getOtherUserAvatar(conv)}
            alt={getOtherUserName(conv)}
            className="conversation-avatar"
          />
          <div className="conversation-info">
            <h4 className="text-white">{getOtherUserName(conv)}</h4>
            <p className="text-gray-400">
              {decrypt(conv.lastMessage) ||
                conv.lastMessage ||
                "No messages yet"}
            </p>
          </div>
          <span className="conversation-time text-gray-500">
            {formatTime(conv.updatedAt)}
          </span>
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <span
              className="unread-badge"
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "#e53e3e",
                color: "white",
                borderRadius: "50%",
                minWidth: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                zIndex: 2,
                boxShadow: "0 0 0 2px #222",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
      );
    },
    [
      selectedConversation,
      getOtherUserAvatar,
      getOtherUserName,
      formatTime,
      user._id,
    ]
  );

  function ChatHeader({
    avatar,
    name,
    userId,
    showDetailsToggle,
    isSidebarOpen,
    onToggleSidebar,
    onlineMap,
  }) {
    const [showStatusText, setShowStatusText] = useState(true);

    useEffect(() => {
      setShowStatusText(true);
      const timer = setTimeout(() => setShowStatusText(false), 3000);
      return () => clearTimeout(timer);
    }, [userId]);

    return (
      <div className="header-content2">
        <div className="header-row">
          <img src={avatar} alt={name} className="conversation-avatar2" />
          <span className="header-name">
            {name}
            <OnlineStatusIndicator
              userId={userId}
              showText={showStatusText}
              onlineMap={onlineMap}
            />
          </span>
        </div>
        {showDetailsToggle && (
          <button
            className="details-toggle"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Close details" : "Show details"}
          >
            {isSidebarOpen ? <FiX /> : <FiFileText />}
          </button>
        )}
      </div>
    );
  }

  const renderChatHeader = () => {
    let avatar,
      name,
      userId,
      showDetailsToggle = false;
    if (selectedConversation) {
      avatar = getOtherUserAvatar(selectedConversation);
      name = getOtherUserName(selectedConversation);

      userId = selectedConversation.participants.find((id) => id !== user._id);
      showDetailsToggle = true;
    } else if (incomingPatient) {
      avatar = incomingPatient.avatar;
      name = incomingPatient.name;
      userId = incomingPatient.id;
    } else {
      return null;
    }
    return (
      <ChatHeader
        avatar={avatar}
        name={name}
        userId={userId}
        showDetailsToggle={showDetailsToggle}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onlineMap={onlineMap}
      />
    );
  };

  useEffect(() => {
    if (!isConnected || !conversations.length) return;
    conversations.forEach((conv) => {
      joinRoom(conv._id);
    });
  }, [isConnected, conversations, joinRoom]);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("register", user._id);
    }
  }, [socket, user?._id]);

  // Add this handler for input change to emit typing events
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !selectedConversation) return;
    socket.emit("typing", { conversationId: selectedConversation._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { conversationId: selectedConversation._id });
    }, 1500); // 1.5 seconds after user stops typing
  };

  // Listen for typing and stopTyping events
  useEffect(() => {
    if (!socket || !selectedConversation) return;
    const handleTyping = ({ userId, conversationId }) => {
      if (conversationId !== selectedConversation._id || userId === user._id)
        return;
      setTypingUsers((prev) => ({ ...prev, [userId]: true }));
    };
    const handleStopTyping = ({ userId, conversationId }) => {
      if (conversationId !== selectedConversation._id || userId === user._id)
        return;
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    };
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedConversation, user._id]);

  // Optional: Clear typing users on conversation change
  useEffect(() => {
    setTypingUsers({});
  }, [selectedConversation?._id]);

  // Log socket connection status and id
  useEffect(() => {
    if (socket) {
      console.log("[Socket] ID:", socket.id, "Connected:", socket.connected);
    }
  }, [socket]);

  // On socket reconnect, re-join all active conversation rooms
  useEffect(() => {
    if (!socket) return;
    const handleReconnect = () => {
      if (conversations && conversations.length > 0) {
        conversations.forEach((conv) => {
          if (conv._id) {
            socket.emit("joinRoom", conv._id);
            console.log("[Socket] Re-joining room:", conv._id);
          }
        });
      }
    };
    socket.on("reconnect", handleReconnect);
    return () => {
      socket.off("reconnect", handleReconnect);
    };
  }, [socket, conversations]);

  // Force reconnect on tab visibility change if socket is not connected
  useEffect(() => {
    const handleVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        socket &&
        !socket.connected
      ) {
        console.log(
          "Tab became visible and socket is disconnected. Forcing reconnect..."
        );
        socket.connect();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [socket]);

  // Emit messageRead for all unread messages as soon as conversation/messages are loaded
  useEffect(() => {
    if (selectedConversation?._id && socket && socket.connected) {
      const unreadMessages = (
        messagesByConversation[selectedConversation._id] || []
      ).filter(
        (msg) =>
          msg.sender !== user._id &&
          (!msg.readStatus || !msg.readStatus[user._id])
      );
      unreadMessages.forEach((msg) => {
        socket.emit("messageRead", {
          messageId: msg._id,
          conversationId: selectedConversation._id,
          userId: user._id,
        });
      });
    }
  }, [selectedConversation?._id, socket, user._id, messagesByConversation]);

  return (
    <div className="chat-screen">
      {/* Socket status indicator removed */}
      <div className="chat-sidebar bg-gray-800 border-r border-gray-700">
        <div className="chat-search bg-gray-700">
          <div className="input-group">
            <span className="input-group-text bg-gray-700 border-0">
              <FiSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              className="form-control bg-gray-700 border-0 text-white"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="conversation-list">
          {fetchError ? (
            <div className="error-message text-red-500 p-4">{fetchError}</div>
          ) : (
            filteredConversations.map(renderConversationItem)
          )}
        </div>
      </div>

      <div className="chat-main bg-gray-900">
        <DetailsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          selectedConversation={selectedConversation}
        />
        {selectedConversation || incomingConversation || incomingPatient ? (
          <>
            <div className="chat-header2 bg-gray-800 border-b border-gray-700">
              {renderChatHeader()}
            </div>
            <div className="messages-wrapper">
              <div className="messages-container">
                {loading ? (
                  <div className="loader text-gray-400"></div>
                ) : (
                  (() => {
                    let lastMessageDate = null;

                    return currentMessages.map((message, index) => {
                      const messageDate = new Date(message.timestamp);
                      const currentDateStr = messageDate.toDateString();

                      const showDateSeparator =
                        currentDateStr !== lastMessageDate;
                      lastMessageDate = currentDateStr;

                      const isLastMessage =
                        index === currentMessages.length - 1;
                      const otherUserId =
                        selectedConversation?.participants.find(
                          (id) => id !== user._id
                        );
                      // Use readStatus as-is (no decryption)
                      const isRead = message.readStatus?.[otherUserId];

                      return (
                        <div key={message._id || index}>
                          {showDateSeparator && (
                            <div className="date-separator">
                              <span>{getDateLabel(message.timestamp)}</span>
                            </div>
                          )}

                          <div
                            className={`message ${
                              message.sender === user._id ? "sent" : "received"
                            }`}
                          >
                            {message.fileInfo ? (
                              <div
                                className="file-message"
                                onClick={() =>
                                  handleFileClick({
                                    ...message.fileInfo,
                                    // No need to decrypt here, already decrypted in decryptMessage
                                    url: message.fileInfo.url,
                                    originalName: message.fileInfo.originalName,
                                  })
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <FiPaperclip />
                                <span>
                                  {message.fileInfo.originalName}{" "}
                                  <span className="file-type">
                                    ({message.fileInfo.mimetype})
                                  </span>
                                </span>
                                <span className="file-view-link">
                                  {message.fileInfo.mimetype ===
                                  "application/pdf"
                                    ? "View"
                                    : "Download"}
                                </span>
                              </div>
                            ) : (
                              <p>{message.content}</p>
                            )}

                            <span className="message-time">
                              {formatTime(message.timestamp)}
                              {message.sender === user._id && (
                                <span className="message-status">
                                  {" • "}
                                  {message.status === "failed" ? (
                                    <span
                                      className="text-red-400 cursor-pointer"
                                      onClick={() => retryMessage(message)}
                                    >
                                      Failed. Retry?
                                    </span>
                                  ) : message.status === "sending" ? (
                                    "Sending..."
                                  ) : isLastMessage ? (
                                    isRead ? (
                                      "Read"
                                    ) : (
                                      "Delivered"
                                    )
                                  ) : null}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()
                )}
                {/* Typing indicator */}
                <div
                  className={
                    "typing-indicator" +
                    (Object.keys(typingUsers).length === 0
                      ? " typing-indicator--hidden"
                      : "")
                  }
                >
                  {Object.keys(typingUsers).map((id) => (
                    <span key={id}>
                      Typing
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-input bg-gray-800 border-t border-gray-700">
              <input
                type="text"
                className="bg-gray-700 text-white border-0 focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message"
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="file-upload-label text-gray-400 hover:text-white"
              >
                <FiPaperclip />
              </label>
              {!socket?.connected && (
                <div className="text-yellow-400 text-sm text-center py-1">
                  ⚠️ Disconnected. Messages will fail to send.
                </div>
              )}

              <button
                onClick={debouncedSendMessage}
                className="text-gray-400 hover:text-white"
              >
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation-selected text-gray-400">
            <h3>Select a conversation to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
