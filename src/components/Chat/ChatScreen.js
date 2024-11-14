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
    <div
      className="container-fluid bg-gray-900"
      style={{
        width: "100vw",
        margin: "0",
        minHeight: "100vh",
      }}
    >
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
              filteredConversations.map((conv) => (
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
                    <p className="text-gray-400">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  <span className="conversation-time text-gray-500">
                    {formatTime(conv.updatedAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-main bg-gray-900">
          {selectedConversation ? (
            <>
              <div className="chat-header2 bg-gray-800 border-b border-gray-700">
                <div className="header-content2">
                  <img
                    src={getOtherUserAvatar(selectedConversation)}
                    alt={getOtherUserName(selectedConversation)}
                    className="conversation-avatar2"
                  />
                  <div className="header-text2">
                    <h3 className="text-white">
                      {getOtherUserName(selectedConversation)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="chat-messages bg-gray-900">
                {loading ? (
                  <div className="loader text-gray-400"></div>
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

      <style jsx>{`
        .chat-screen {
          display: flex;
          height: calc(100vh - 60px);
          overflow: hidden;
          background-color: #0f172a;
        }

        .chat-sidebar {
          width: 260px;
          display: flex;
          flex-direction: column;
          background-color: #1e293b;
          border-right: 1px solid #334155;
        }

        .chat-search {
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid #334155;
        }

        .conversation-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 50px;
        }

        .conversation-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 0.75rem;
          object-fit: cover;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-info h4 {
          margin: 0;
          font-size: 0.813rem;
          font-weight: 500;
          margin-bottom: 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-info p {
          margin: 0;
          font-size: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-time {
          font-size: 0.65rem;
          color: #64748b;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 45px;
          border-bottom: 1px solid #334155;
        }

        .chat-header h3 {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        .chat-messages {
          flex: 1;
          padding: 0.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .chat-header2 {
          padding: 0.75rem;
          min-height: 45px;
          border-bottom: 1px solid #334155;
        }

        .header-content2 {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .conversation-avatar2 {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .header-text2 {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .chat-header2 h3 {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        .message-container {
          // Add this new class
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }

        .message {
          max-width: 70%;
          margin-bottom: 0.4rem;
          display: inline-block;
          /* Remove align-self from here as it's not needed for the container */
        }

        /* Remove the background colors from the outer message containers */
        .message.sent,
        .message.received {
          background: none; /* Ensure no background color */
          padding: 0; /* Remove any padding */
          margin: 0 0 0.4rem 0; /* Keep only bottom margin for spacing between messages */
          border-radius: 0; /* Remove any border radius */
        }

        .message p {
          display: inline-block;
          font-size: 0.75rem;
          padding: 0.4rem 0.65rem;
          border-radius: 1rem;
          margin: 0;
          word-wrap: break-word;
          line-height: 1.2;
          max-width: 100%;
          color: white;
        }

        /* Add specific alignment for sent/received */
        .message.sent {
          align-self: flex-end;
        }

        .message.received {
          align-self: flex-start;
        }

        .message.sent p {
          background-color: #2563eb;
          border-bottom-right-radius: 0.25rem;
        }

        .message.received p {
          background-color: #334155;
          border-bottom-left-radius: 0.25rem;
        }
        .file-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.65rem;
          border-radius: 1rem;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          background-color: #334155; /* Add this */
          color: white; /* Add this */
          cursor: pointer; /* Add this */
        }

        /* Add this for sent file messages */
        .message.sent .file-message {
          background-color: #2563eb;
        }

        .message-time {
          font-size: 0.65rem;
          margin-top: 0.15rem;
          color: #64748b;
          padding: 0 0.4rem; // Add padding
        }

        .message.sent .message-time {
          text-align: right; // Align timestamp to right for sent messages
        }

        .chat-input {
          padding: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border-top: 1px solid #334155;
        }

        .chat-input input {
          flex: 1;
          padding: 0.4rem 0.75rem;
          border-radius: 1.5rem;
          outline: none;
          font-size: 0.75rem;
        }

        .chat-input button,
        .file-upload-label {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.35rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .chat-input button:hover,
        .file-upload-label:hover {
          background-color: #334155;
        }

        .no-conversation-selected {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 0.813rem;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 2px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>

      <style jsx global>{`
        body {
          background-color: #0f172a !important;
          margin: 0;
          padding: 0;
          font-size: 13px;
        }

        #root {
          background-color: #0f172a;
          min-height: 100vh;
        }

        .bg-gray-900 {
          background-color: #0f172a;
        }
        .bg-gray-800 {
          background-color: #1e293b;
        }
        .bg-gray-700 {
          background-color: #334155;
        }
        .bg-gray-600 {
          background-color: #475569;
        }

        .text-white {
          color: #ffffff;
        }
        .text-gray-400 {
          color: #94a3b8;
        }
        .text-gray-500 {
          color: #64748b;
        }
        .border-gray-700 {
          border-color: #334155;
        }

        .hover\:bg-gray-700:hover {
          background-color: #334155;
        }
        .hover\:bg-gray-600:hover {
          background-color: #475569;
        }

        .message.sent p {
          background-color: #2563eb;
        }

        .message.received p {
          background-color: #334155;
        }

        .loader {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 2px solid #334155;
          border-radius: 50%;
          border-top-color: #60a5fa;
          animation: spin 1s ease-in-out infinite;
          margin: auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-message {
          background-color: #991b1b;
          color: white;
          padding: 0.6rem;
          border-radius: 0.4rem;
          margin: 0.6rem;
          text-align: center;
          font-size: 0.75rem;
        }

        .input-group-text {
          background-color: transparent;
          border: none;
        }

        .form-control {
          background-color: #1e293b;
          border: none;
          color: white;
          font-size: 0.75rem;
        }

        .form-control:focus {
          background-color: #334155;
          border: none;
          box-shadow: none;
          color: white;
        }

        .form-control::placeholder {
          color: #64748b;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default ChatScreen;
