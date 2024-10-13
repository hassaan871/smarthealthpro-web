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

const ChatScreen = () => {
  const { setUserInfo, userInfo } = useContext(Context);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const messagesEndRef = useRef(null);
  const { socket, connectSocket } = useSocketContext();

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
      const userId = userInfo || localStorage.getItem("userToken");
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
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/conversations/getMessages/${conversationId}`
        );
        const decryptedMessages = response.data.map(decryptMessage);
        setMessages(decryptedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setFetchError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [decryptMessage]
  );

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
    if (!socket || !socket.connected) {
      console.log("Initializing socket connection...");
      connectSocket();
    }

    if (socket) {
      console.log("Setting up newMessage event listener");
      socket.on("newMessage", handleNewMessage);
    }

    return () => {
      if (socket) {
        console.log("Cleaning up newMessage event listener");
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket, connectSocket, handleNewMessage]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const userString = localStorage.getItem("userToken");
    setUserInfo(userString);
  }, [setUserInfo]);

  useEffect(() => {
    if (!socket || !socket.connected) {
      console.log("Initializing socket connection...");
      connectSocket();
    }

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        connectSocket();
      }
    };

    if (socket) {
      socket.on("disconnect", handleDisconnect);
    }

    return () => {
      if (socket) {
        socket.off("disconnect", handleDisconnect);
      }
    };
  }, [socket, connectSocket]);

  useEffect(() => {
    if (socket) {
      const handleConversationUpdate = (updatedConversation) => {
        setConversations((prevConversations) => {
          const index = prevConversations.findIndex(
            (c) => c._id === updatedConversation._id
          );
          if (index !== -1) {
            // Update existing conversation
            return [
              ...prevConversations.slice(0, index),
              updatedConversation,
              ...prevConversations.slice(index + 1),
            ];
          } else {
            // Add new conversation
            return [updatedConversation, ...prevConversations];
          }
        });
      };

      socket.on("conversationUpdate", handleConversationUpdate);

      return () => {
        socket.off("conversationUpdate", handleConversationUpdate);
      };
    }
  }, [socket]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const encryptedContent = encrypt(newMessage);
    const messageData = {
      conversationId: selectedConversation._id,
      sender: userInfo,
      content: encryptedContent,
      timestamp: new Date(),
    };

    try {
      console.log("Sending message:", messageData);

      const response = await axios.post(
        `http://localhost:5000/conversations/${selectedConversation._id}/messages`,
        messageData
      );
      console.log("Message sent successfully:", response.data);

      await axios.put(
        `http://localhost:5000/conversations/${selectedConversation._id}/lastMessage`,
        { lastMessage: newMessage }
      );

      // setConversations((prevConversations) =>
      //   prevConversations.map((conv) =>
      //     conv._id === selectedConversation._id
      //       ? { ...conv, lastMessage: newMessage }
      //       : conv
      //   )
      // );

      socket.emit("sendMessage", { newMessage: response.data });
      console.log("Message emitted to socket");
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
      if (socket && conversationId) {
        socket.emit("joinRoom", conversationId);
        console.log(`Joined room: ${conversationId}`);
      }
    },
    [socket]
  );

  useEffect(() => {
    if (selectedConversation) {
      joinConversationRoom(selectedConversation._id);
    }
  }, [selectedConversation, joinConversationRoom]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedConversation || !socket) return;

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
        {
          lastMessage: "File shared",
        }
      );

      // setConversations((prevConversations) =>
      //   prevConversations.map((conv) =>
      //     conv._id === selectedConversation._id
      //       ? { ...conv, lastMessage: "File shared" }
      //       : conv
      //   )
      // );

      socket.emit("sendMessage", { newMessage: response.data });
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

  return (
    <div className="chat-screen light-theme">
      <div className="chat-sidebar">
        <div className="chat-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="conversation-list">
          {fetchError ? (
            <div className="error-message">{fetchError}</div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${
                  selectedConversation?._id === conv._id ? "active" : ""
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <img
                  src={getOtherUserAvatar(conv)}
                  alt={getOtherUserName(conv)}
                  className="conversation-avatar"
                />
                <div className="conversation-info">
                  <h4>{getOtherUserName(conv)}</h4>
                  <p>{conv.lastMessage || "No messages yet"}</p>
                </div>
                <span className="conversation-time">
                  {formatTime(conv.updatedAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h3>{getOtherUserName(selectedConversation)}</h3>
            </div>
            <div className="chat-messages">
              {loading ? (
                <div className="loader">Loading...</div>
              ) : (
                messages.map((message, index) => (
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
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
              <input
                type="text"
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
              <label htmlFor="file-upload" className="file-upload-label">
                <FiPaperclip />
              </label>
              <button onClick={debouncedSendMessage}>
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation-selected">
            <h3>Select a conversation to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
