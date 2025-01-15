import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import Context from "../context/context";
import { useSocketContext } from "../../components/context/SocketContext";
import axios from "axios";
import { FiSearch, FiSend, FiPaperclip } from "react-icons/fi";
import "./ChatScreen.css";
import { encrypt, decrypt } from "../encrypt/Encrypt";
import { debounce } from "lodash";
import { useLocation } from "react-router-dom";

import { FiX, FiMessageSquare, FiFileText } from "react-icons/fi";

// Add this component at the top of your file
const OnlineStatusIndicator = ({ userId }) => {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket || !userId) {
      console.log("Missing socket or userId:", { socket: !!socket, userId });
      return;
    }

    // Check initial status
    socket.emit("checkOnlineStatus", userId);

    // Listen for status updates
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
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-500"
        }`}
      />
      <span className="text-sm text-gray-400">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};

const DetailsSidebar = ({ isOpen, onClose, selectedConversation }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [loadingStates, setLoadingStates] = useState({
    summary: false,
    notes: false,
    prescriptions: false,
  });
  const [summaries, setSummaries] = useState([]);
  const [notes, setNotes] = useState([]);
  const [prescriptions, setPrescriptions] = useState({});
  const { userInfo } = useContext(Context);

  useEffect(() => {
    if (selectedConversation?.participants[1]) {
      if (activeTab === "summary") {
        fetchSummaries();
      } else if (activeTab === "notes") {
        fetchNotes(selectedConversation.participants[1]);
      } else if (activeTab === "prescriptions" && selectedConversation._id) {
        fetchPrescriptions();
      }
    } else {
      console.log("h2");
    }
  }, [selectedConversation, activeTab]);

  const setLoadingFor = (tab, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [tab]: isLoading,
    }));
  };

  const fetchSummaries = async () => {
    console.log("fetching summary");
    try {
      setLoadingFor("summary", true);
      const patientIDIndex = selectedConversation.participants.findIndex(
        (id) => id !== userInfo
      );
      const patientID = selectedConversation.participants[patientIDIndex];
      console.log("userinfo: ", userInfo);
      const link = `http://localhost:5000/user/getSummaries/${patientID}/${userInfo}`;
      console.log("link is: ", link);
      const response = await axios.get(link);
      console.log("Summaries response:", response.data);
      setSummaries(response.data);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      setSummaries([]);
    } finally {
      setLoadingFor("summary", false);
    }
  };

  const fetchNotes = async (patientId) => {
    try {
      setLoadingFor("notes", true);
      const userString = localStorage.getItem("userToken");
      const response = await axios.get(
        `http://localhost:5000/user/getMatchingNotes`,
        {
          params: {
            doctorId: userString,
            patientId: patientId,
          },
        }
      );
      const decryptedNotes = response.data.notes.map((note) => ({
        ...note,
        note: decrypt(note.note), // Decrypt the note content
      }));
      setNotes(decryptedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setLoadingFor("notes", false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      setLoadingFor("prescriptions", true);

      const patientIDIndex = selectedConversation.participants.findIndex(
        (id) => id !== userInfo
      );
      const patientID = selectedConversation.participants[patientIDIndex];
      const response = await fetch(
        `http://localhost:5000/appointment/${patientID}/prescription`
      );
      const data = await response.json();
      const decryptedPrescriptions = data.data.map((record) => ({
        ...record,
        prescriptions: record.prescriptions.map((prescription) => ({
          ...prescription,
          medication: decrypt(prescription.medication),
          dosage: decrypt(prescription.dosage),
          frequency: decrypt(prescription.frequency),
          duration: decrypt(prescription.duration),
          instructions: decrypt(prescription.instructions),
        })),
      }));
      console.log("Raw API Response:", data);
      setPrescriptions(decryptedPrescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setPrescriptions({});
    } finally {
      setLoadingFor("prescriptions", false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const renderLoader = () => (
    <div className="loading-state">
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loader-text">Loading...</div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loadingStates[activeTab]) {
      return renderLoader();
    }

    switch (activeTab) {
      case "summary":
        return (
          <div className="summaries-list">
            {summaries?.length > 0 ? (
              summaries.map((summary, index) => (
                <div key={index} className="summary-item">
                  <div className="item-header">
                    <span className="item-type">Summary</span>
                    <span className="item-date">
                      {formatDate(summary.createdAt)}
                    </span>
                  </div>
                  <div className="item-content">{summary.summary}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">No summaries available</div>
            )}
          </div>
        );

      case "notes":
        return (
          <div className="notes-list">
            {notes?.length > 0 ? (
              notes.map((note, index) => (
                <div key={index} className="note-item">
                  <div className="item-header">
                    <span className="item-type">Clinical Note</span>
                    <span className="item-date">{formatDate(note.date)}</span>
                  </div>
                  <div className="item-content">{note.note}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">No clinical notes available</div>
            )}
          </div>
        );

      case "prescriptions":
        return (
          <div className="prescriptions-list">
            {prescriptions.length > 0 ? (
              prescriptions.map((appointment) =>
                appointment.prescriptions.map((prescription, index) => (
                  <div key={index} className="prescription-item">
                    <div className="item-header">
                      <span className="item-type">Prescription</span>
                      <span className="item-date">{appointment.date}</span>
                    </div>
                    <div className="prescription-content">
                      <div className="medicine-name">
                        {prescription.medication}
                      </div>
                      <div className="medicine-details">
                        <div>Dosage: {prescription.dosage}</div>
                        <div>Frequency: {prescription.frequency}</div>
                        <div>Duration: {prescription.duration}</div>
                        <div>Instructions: {prescription.instructions}</div>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="empty-state">No prescriptions available</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`details-sidebar ${isOpen ? "open" : ""}`}>
      <div className="details-content">
        <div className="tabs-header">
          <button
            className={`tab ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={`tab ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
          <button
            className={`tab ${activeTab === "prescriptions" ? "active" : ""}`}
            onClick={() => setActiveTab("prescriptions")}
          >
            Prescriptions
          </button>
          <div className="sidebar-header">
            <button onClick={onClose} className="close-sidebar-btn">
              <FiX />
            </button>
          </div>
        </div>

        <div className="tab-content">{renderContent()}</div>
      </div>
    </div>
  );
};

const ChatScreen = () => {
  const { setUserInfo, userInfo } = useContext(Context);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messageReadStatus, setMessageReadStatus] = useState({});
  const [activeTab, setActiveTab] = useState("chatSummaries");
  const messagesEndRef = useRef(null);
  const {
    socket,
    connectSocket,
    disconnectSocket, // New: Added disconnectSocket
    joinRoom, // New: Added joinRoom for explicit room management
    isConnected, // New: Added connection status
  } = useSocketContext();
  const location = useLocation();
  // console.log("Full location object:", location); // Debug full location object
  const incomingConversation = location.state?.conversation;
  // console.log("Incoming conversation:", incomingConversation);
  // console.log("Received conversation in ChatScreen:", incomingConversation);
  const incomingPatient = location.state?.patient;
  const doctorInfo = location.state?.doctorInfo;

  useEffect(() => {
    if (socket) {
      const handleMessageRead = (data) => {
        console.log("Received messageRead event:", data);

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === data.messageId
              ? {
                  ...msg,
                  readStatus: {
                    ...msg.readStatus,
                    [data.userId]: true,
                  },
                }
              : msg
          )
        );
      };

      socket.on("messageRead", handleMessageRead);
      return () => socket.off("messageRead", handleMessageRead);
    }
  }, [socket]);

  useEffect(() => {
    if (selectedConversation?._id && userInfo) {
      const markMessagesAsRead = async () => {
        try {
          await axios.post(
            `http://localhost:5000/conversations/${selectedConversation._id}/mark-messages-read`,
            {
              conversationId: selectedConversation._id,
              userId: userInfo,
            }
          );

          // Reset unread count
          await axios.post(
            `http://localhost:5000/conversations/${selectedConversation._id}/read/${userInfo}`
          );
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };

      markMessagesAsRead();
    }
  }, [selectedConversation?._id, userInfo]);

  useEffect(() => {
    console.log("ChatScreen mounted - initializing socket connection");
    connectSocket(); // Connect socket when ChatScreen mounts

    // Cleanup function runs when component unmounts
    return () => {
      console.log("ChatScreen unmounting - cleaning up socket connection");
      disconnectSocket(); // Disconnect socket when leaving ChatScreen
    };
  }, [connectSocket, disconnectSocket]);

  // 1. Consolidate socket event handlers into one place, outside of useEffect
  const socketHandlers = {
    handleDisconnect: (socket, connectSocket) => (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        connectSocket();
      }
    },

    handleConversationUpdate: (setConversations) => (updatedConversation) => {
      setConversations((prevConversations) => {
        const index = prevConversations.findIndex(
          (c) => c._id === updatedConversation._id
        );
        if (index !== -1) {
          return [
            ...prevConversations.slice(0, index),
            updatedConversation,
            ...prevConversations.slice(index + 1),
          ];
        }
        return [updatedConversation, ...prevConversations];
      });
    },
  };

  // 2. Replace your current socket useEffect with this optimized version

  // 3. Remove the standalone userInfo useEffect and combine it with socket initialization
  useEffect(() => {
    const userString = localStorage.getItem("userToken");
    setUserInfo(userString);
  }, [setUserInfo]);

  // Function to create a new conversation
  const createNewConversation = async (firstMessage) => {
    try {
      console.log("Creating new conversation...");

      const newConversationResponse = await axios.post(
        "http://localhost:5000/conversations",
        {
          currentUserId: doctorInfo.id,
          otherUserId: incomingPatient.id,
          currentUserObjectIdAvatar: doctorInfo.avatar,
          otherUserObjectIdAvatar: incomingPatient.avatar,
          currentUserObjectIdName: doctorInfo.name,
          otherUserObjectIdName: incomingPatient.name,
        }
      );

      const newConversation = newConversationResponse.data;
      console.log("New conversation created:", newConversation);

      // Set the selected conversation
      setSelectedConversation(newConversation);

      // Important: Join the socket room for the new conversation
      if (socket?.connected && newConversation._id) {
        socket.emit("joinRoom", newConversation._id);
        console.log("Joined room:", newConversation._id);
      }

      // Wait for room join to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const encryptedContent = encrypt(firstMessage);
      const messageData = {
        conversationId: newConversation._id,
        sender: userInfo,
        content: encryptedContent,
        timestamp: new Date(),
      };

      console.log("Sending first message with data:", messageData);

      const messageResponse = await axios.post(
        `http://localhost:5000/conversations/${newConversation._id}/messages`,
        messageData
      );

      await axios.put(
        `http://localhost:5000/conversations/${newConversation._id}/lastMessage`,
        { lastMessage: firstMessage }
      );

      // Emit the message with conversation ID
      if (socket?.connected) {
        socket.emit("sendMessage", {
          newMessage: messageResponse.data,
          conversationId: newConversation._id, // Add this line
        });
        console.log(
          "Message emitted to socket with conversationId:",
          newConversation._id
        );
      }

      // Update conversations list
      setConversations((prev) => [newConversation, ...prev]);
      setNewMessage("");

      return newConversation;
    } catch (error) {
      console.error("Error in createNewConversation:", error);
      throw error;
    }
  };

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
          ? {
              ...msg.fileInfo,
              originalName: "Unknown file",
              url: "",
            }
          : null,
      };
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userToken");
      if (!userId) {
        setFetchError("User not authenticated. Please log in.");
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/conversations/${userId}`
      );
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setFetchError("Failed to load conversations. Please try again later.");
    }
  }, [userInfo]);

  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return;

      try {
        setLoading(true);
        console.log("Fetching messages for conversation:", conversationId);

        const response = await axios.get(
          `http://localhost:5000/conversations/${conversationId}/messages`
        );

        console.log("Raw messages from server:", response.data);

        const decryptedMessages = response.data.map((msg) => {
          const decryptedMsg = decryptMessage(msg);
          // Ensure readStatus exists
          return {
            ...decryptedMsg,
            readStatus: decryptedMsg.readStatus || {
              [userInfo]: true,
            },
          };
        });

        setMessages(decryptedMessages);

        // Mark messages as read immediately after fetching
        if (socket && socket.connected) {
          const lastMessage = response.data[response.data.length - 1];
          if (lastMessage && lastMessage.sender !== userInfo) {
            socket.emit("messageRead", {
              messageId: lastMessage._id,
              conversationId: conversationId,
              userId: userInfo,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setFetchError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [decryptMessage, userInfo, socket]
  );

  useEffect(() => {
    if (selectedConversation?._id && isConnected) {
      console.log("Joining conversation room:", selectedConversation._id);
      joinRoom(selectedConversation._id);
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation, isConnected, joinRoom, fetchMessages]);

  const handleNewMessage = useCallback(
    (newMessage) => {
      console.log("Received new message:", newMessage);
      const decryptedMessage = decryptMessage(newMessage);

      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === decryptedMessage._id)) {
          return prevMessages;
        }
        return [...prevMessages, decryptedMessage];
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

  useEffect(() => {
    let isSubscribed = true;

    const initializeSocket = async () => {
      if (!socket || !socket.connected) {
        console.log("Initializing socket connection...");
        await connectSocket();
      }

      // Add connection status logging
      console.log("Socket connection status:", {
        socketExists: !!socket,
        isConnected: socket?.connected,
        socketId: socket?.id,
      });

      if (socket && isSubscribed) {
        socket.on("connect", () => {
          console.log("Socket connected successfully:", socket.id);
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          if (reason === "io server disconnect") {
            connectSocket();
          }
        });

        socket.on("newMessage", (data) => {
          console.log("Received new message:", data);
          if (data.conversationId) {
            handleNewMessage(data);
          } else {
            console.warn("Received message without conversationId:", data);
          }
        });

        // Add error handling
        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        socket.on("error", (error) => {
          console.error("Socket error:", error);
        });

        if (selectedConversation?._id) {
          socket.emit("joinRoom", selectedConversation._id);
          console.log("Joined room:", selectedConversation._id);
        }
      }
    };

    initializeSocket();

    return () => {
      isSubscribed = false;
      if (socket) {
        socket.off("newMessage");
        socket.off("disconnect");
        socket.off("connect");
        socket.off("connect_error");
        socket.off("error");
      }
    };
  }, [socket, connectSocket, selectedConversation]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    console.log(
      "useEffect triggered with incomingConversation:",
      incomingConversation
    );
    // If we have an incoming conversation from navigation, select it
    if (incomingConversation) {
      console.log("Setting selected conversation:", incomingConversation);
      setSelectedConversation(incomingConversation);
      // Fetch messages for existing conversation
      if (incomingConversation._id) {
        console.log(
          "Fetching messages for conversation ID:",
          incomingConversation._id
        );
        fetchMessages(incomingConversation._id);
      }
    }
  }, [incomingConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Modified send message function

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket?.connected) return;

    try {
      let conversationToUse = selectedConversation;

      if (!conversationToUse && incomingPatient) {
        try {
          conversationToUse = await createNewConversation(newMessage);
          return; // createNewConversation handles everything
        } catch (error) {
          console.error("Error creating new conversation:", error);
          alert("Failed to create conversation. Please try again.");
          return;
        }
      }

      const encryptedContent = encrypt(newMessage);
      const messageData = {
        conversationId: conversationToUse._id,
        sender: userInfo,
        content: encryptedContent,
        timestamp: new Date(),
      };

      const response = await axios.post(
        `http://localhost:5000/conversations/${conversationToUse._id}/messages`,
        messageData
      );

      await axios.put(
        `http://localhost:5000/conversations/${conversationToUse._id}/lastMessage`,
        { lastMessage: newMessage }
      );

      // Include conversationId in socket emission
      if (socket?.connected) {
        socket.emit("sendMessage", {
          newMessage: response.data,
          conversationId: conversationToUse._id, // Add this line
        });
        console.log(
          "Message emitted to socket with conversationId:",
          conversationToUse._id
        );
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  };

  const debouncedSendMessage = useCallback(
    debounce(() => sendMessage(), 300, { leading: true, trailing: false }),
    [sendMessage]
  );

  const joinConversationRoom = useCallback(
    (conversationId) => {
      if (!socket?.connected || !conversationId) return;

      console.log("Attempting to join room:", conversationId);
      socket.emit("joinRoom", conversationId);
    },
    [socket]
  );

  useEffect(() => {
    if (selectedConversation?._id) {
      console.log("Selected conversation changed:", selectedConversation._id);
      joinConversationRoom(selectedConversation._id);
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation, joinConversationRoom, fetchMessages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedConversation || !socket?.connected) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await axios.post(
        `http://localhost:5000/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const encryptedFileName = encrypt(uploadResponse.data.file.originalName);
      const encryptedFileUrl = encrypt(uploadResponse.data.file.url);

      const messageData = {
        content: encrypt("File shared"),
        sender: userInfo,
        conversationId: selectedConversation._id,
        timestamp: new Date(),
        fileInfo: {
          ...uploadResponse.data.file,
          originalName: encryptedFileName,
          url: encryptedFileUrl,
        },
      };

      const response = await axios.post(
        `http://localhost:5000/conversations/${selectedConversation._id}/messages`,
        messageData
      );

      await axios.put(
        `http://localhost:5000/conversations/${selectedConversation._id}/lastMessage`,
        { lastMessage: "File shared" }
      );

      if (socket.connected) {
        socket.emit("sendMessage", {
          newMessage: response.data,
          conversationId: selectedConversation._id, // Add conversationId here
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(time).toLocaleString("en-US", options);
  };

  const getOtherUserName = (conversation) => {
    if (!conversation || !conversation.name || !userInfo) return "Unknown";
    const otherUserIndex = conversation.participants.findIndex(
      (id) => id !== userInfo
    );
    return conversation.name[otherUserIndex] || "Unknown";
  };

  const getOtherUserAvatar = (conversation) => {
    if (!conversation || !conversation.avatar || !userInfo)
      return "default-avatar.png";
    const otherUserIndex = conversation.participants.findIndex(
      (id) => id !== userInfo
    );

    return conversation.avatar[otherUserIndex]?.url?.length > 0
      ? conversation.avatar[otherUserIndex].url
      : conversation.avatar[otherUserIndex];
  };

  const filteredConversations = conversations.filter((conv) =>
    getOtherUserName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleFileClick = (fileInfo) => {
    if (fileInfo && fileInfo.url) {
      const decodedUrl = fileInfo.url;
      const decodedFileName = fileInfo.originalName;

      if (fileInfo.mimetype === "application/pdf") {
        window.open(decodedUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = decodedUrl;
        link.download = decodedFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Modified conversation item rendering
  const renderConversationItem = (conv) => (
    <div
      key={conv._id}
      className={`conversation-item bg-gray-800 hover:bg-gray-700 ${
        selectedConversation?._id === conv._id ? "bg-gray-700" : ""
      }`}
      onClick={() => setSelectedConversation(conv)}
    >
      <img
        src={getOtherUserAvatar(conv)}
        alt={getOtherUserName(conv)}
        className="conversation-avatar"
      />
      <div className="conversation-info">
        <h4 className="text-white">{getOtherUserName(conv)}</h4>
        <p className="text-gray-400">{conv.lastMessage || "No messages yet"}</p>
      </div>
      <span className="conversation-time text-gray-500">
        {formatTime(conv.updatedAt)}
      </span>
    </div>
  );

  // Render the active chat header
  const renderChatHeader = () => {
    if (selectedConversation) {
      const otherUserId = selectedConversation.participants.find(
        (id) => id !== userInfo
      );

      return (
        <div className="header-content2">
          <div className="flex items-center gap-3">
            <img
              src={getOtherUserAvatar(selectedConversation)}
              alt={getOtherUserName(selectedConversation)}
              className="conversation-avatar2"
            />
            <div className="header-text2">
              <h3 className="text-white">
                {getOtherUserName(selectedConversation)}
              </h3>
              <OnlineStatusIndicator userId={otherUserId} />
            </div>
          </div>
          <button
            className="details-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FiX /> : <FiFileText />}
          </button>
        </div>
      );
    } else if (incomingPatient) {
      return (
        <div className="header-content2">
          <div className="flex items-center gap-3">
            <img
              src={incomingPatient.avatar}
              alt={incomingPatient.name}
              className="conversation-avatar2"
            />
            <div className="header-text2">
              <h3 className="text-white">{incomingPatient.name}</h3>
              <OnlineStatusIndicator userId={incomingPatient.id} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (selectedConversation?._id && userInfo) {
      const markMessagesAsRead = async () => {
        try {
          // Mark messages as read in the backend
          await axios.post(
            `http://localhost:5000/conversations/${selectedConversation._id}/mark-messages-read`,
            {
              conversationId: selectedConversation._id,
              userId: userInfo,
            }
          );

          // Emit socket event for real-time update
          if (socket && socket.connected) {
            const unreadMessages = messages.filter(
              (msg) =>
                msg.sender !== userInfo &&
                (!msg.readStatus || !msg.readStatus[userInfo])
            );

            unreadMessages.forEach((msg) => {
              socket.emit("messageRead", {
                messageId: msg._id,
                conversationId: selectedConversation._id,
                userId: userInfo,
              });
            });
          }
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };

      markMessagesAsRead();
    }
  }, [selectedConversation?._id, userInfo, socket]);

  return (
    <div className="chat-screen">
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
                  messages.map((message, index) => {
                    const isLastMessage = index === messages.length - 1;
                    const otherUserId = selectedConversation.participants.find(
                      (id) => id !== userInfo
                    );
                    const isRead =
                      message.readStatus && message.readStatus[otherUserId];

                    return (
                      <div
                        key={index}
                        className={`message ${
                          message.sender === userInfo ? "sent" : "received"
                        }`}
                      >
                        {message.fileInfo ? (
                          <div
                            className="file-message"
                            onClick={() => handleFileClick(message.fileInfo)}
                            style={{ cursor: "pointer" }}
                          >
                            <FiPaperclip />
                            <span>{message.fileInfo.originalName}</span>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                          {message.sender === userInfo && isLastMessage && (
                            <span className="message-status">
                              {" • "}
                              {isRead ? "Read" : "Delivered"}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="chat-input bg-gray-800 border-t border-gray-700">
              <input
                type="text"
                className="bg-gray-700 text-white border-0 focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
