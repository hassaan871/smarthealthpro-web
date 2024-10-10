import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../components/context/UserContext";
import { useSocketContext } from "../../components/context/SocketContext";
import axios from "axios";
import { FiSearch, FiSend, FiPaperclip } from "react-icons/fi";
import "./ChatScreen.css";
import { encrypt, decrypt } from "../encrypt/Encrypt";

const ChatScreen = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { socket, connectSocket } = useSocketContext();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const messagesEndRef = useRef(null);

  const decryptMessage = (msg) => {
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
  };

  useEffect(() => {
    fetchConversations();
    if (socket) {
      socket.on("newMessage", handleNewMessage);
      return () => socket.off("newMessage", handleNewMessage);
    } else {
      connectSocket();
    }
  }, [socket, connectSocket]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const userString = localStorage.getItem("userToken");
    setUserInfo(userString);
    console.log("userInfo: ", userInfo);
  }, [userInfo]);

  const fetchConversations = async () => {
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
  };

  const fetchMessages = async (conversationId) => {
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
      scrollToBottom();
    }
  };

  const handleNewMessage = (newMessage) => {
    console.log("Received message:", newMessage);
    const decryptedMessage = decryptMessage(newMessage);
    if (
      selectedConversation &&
      decryptedMessage.conversationId === selectedConversation._id
    ) {
      setMessages((prevMessages) => [...prevMessages, decryptedMessage]);
    }
    updateLastMessage(
      decryptedMessage.conversationId,
      decryptedMessage.content
    );
    scrollToBottom();
  };

  const updateLastMessage = (conversationId, lastMessage) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv._id === conversationId ? { ...conv, lastMessage } : conv
      )
    );
  };

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
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, content: newMessage },
      ]);
      setNewMessage("");
      scrollToBottom();

      const response = await axios.post(
        `http://localhost:5000/conversations/${selectedConversation._id}/messages`,
        messageData
      );

      await axios.put(
        `http://localhost:5000/conversations/${selectedConversation._id}/lastMessage`,
        {
          lastMessage: newMessage,
        }
      );

      updateLastMessage(selectedConversation._id, newMessage);

      socket.emit("sendMessage", { newMessage: response.data });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  };

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

      setMessages((prevMessages) => [
        ...prevMessages,
        decryptMessage(response.data),
      ]);
      scrollToBottom();

      await axios.put(
        `http://localhost:5000/conversations/${selectedConversation._id}/lastMessage`,
        {
          lastMessage: "File shared",
        }
      );

      updateLastMessage(selectedConversation._id, "File shared");

      socket.emit("sendMessage", { newMessage: response.data });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(time).toLocaleString("en-US", options);
  };

  const filteredConversations = conversations.filter((conv) =>
    (conv.name[1] || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (fileInfo) => {
    console.log("file info from handle file: ", fileInfo);
    console.log("file info url: ", fileInfo.url);
    if (fileInfo && fileInfo.url) {
      const decodedUrl = fileInfo.url;
      const decodedFileName = fileInfo.originalName;

      // For PDF files, open in a new tab
      if (fileInfo.mimetype === "application/pdf") {
        console.log("decodedUrl: ", decodedUrl);
        window.open(decodedUrl, "_blank");
      } else {
        console.log("file is not a pdf");
        // For other file types, trigger a download
        const link = document.createElement("a");
        link.href = decodedUrl;
        link.download = decodedFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      console.log("file doesnt exist");
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
                  src={conv.avatar[1] || "default-avatar.png"}
                  alt={conv.name[1] || "Unknown"}
                  className="conversation-avatar"
                />
                <div className="conversation-info">
                  <h4>{conv.name[1] || "Unknown"}</h4>
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
              <h3>{selectedConversation.name[1] || "Unknown"}</h3>
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
              <button onClick={sendMessage}>
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
