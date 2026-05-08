import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { setOnlineUsers } from "../utils/presenceSlice";
import { createSocketConnection } from "../utils/socket";
import { setSocket, incrementUnread } from "../utils/chatSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const socket = useSelector((store) => store.chat?.socket);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (userData) return;
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
        console.error(err);
      }
    };

    fetchUser();
  }, [userData, navigate, dispatch]);

   useEffect(() => {
    if (userData?._id && !socket) {
      const s = createSocketConnection();
      dispatch(setSocket(s));
    }
  }, [userData, socket, dispatch]);

   useEffect(() => {
    if (userData?._id && socket) {
      
      socket.emit("userOnline", userData._id);

      socket.on("updateOnlineUsers", (onlineIds) => {
        dispatch(setOnlineUsers(onlineIds));
      });

      return () => {
        socket.off("updateOnlineUsers");
      };
    }
  }, [userData, socket, dispatch]);

  useEffect(() => {
    if (userData?._id && socket) {
      const handleIncoming = () => {
        if (!location.pathname.startsWith("/chat")) {
          dispatch(incrementUnread());
        }
      };

      socket.on("messageReceived", handleIncoming);
      return () => {
        socket.off("messageReceived", handleIncoming);
      };
    }
  }, [userData, socket, dispatch, location.pathname]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen"> 
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
