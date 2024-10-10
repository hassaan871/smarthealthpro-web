import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [emailGlobal, setEmailGlobal] = useState("");
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [id, setId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [popularDoctors, setPopularDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load user data from localStorage when the component mounts
    const loadUserData = () => {
      const storedToken = localStorage.getItem("userToken");

      if (storedToken) setToken(storedToken);
    };
    loadUserData();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (token) localStorage.setItem("userToken", token);
  }, [token, userInfo]);

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        userName,
        setUserName,
        emailGlobal,
        setEmailGlobal,
        image,
        setImage,
        avatar,
        setAvatar,
        id,
        setId,
        popularDoctors,
        setPopularDoctors,
        userInfo,
        setUserInfo,
        appointments,
        setAppointments,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
