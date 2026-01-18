import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { connect } from "mongoose";

const backendurl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if user is authenticated and if so, set the user data and connect the socket

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/authcheck");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Login  function to handle user authentication and socket connection

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Connect socket  function to  hadle socket connection and  online users updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendurl, {
      userId: ussrData._id,
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", () => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
