import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "../utils/notification";
import { resetUnread } from "../utils/chatSlice";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socket = useSelector((store) => store.chat?.socket);
  const onlineUsers = useSelector((store) => store.presence);
  
  const isOnline = onlineUsers.some(id => String(id) === String(targetUserId));

  useEffect(() => {
    dispatch(resetUnread());
  }, [dispatch]);

  const userFirstName = user?.firstName;
  const userLastName = user?.lastName;

  useEffect(() => {
    if (!targetUserId) return;

    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
          withCredentials: true,
        });

        const chatMessages = (res?.data?.messages || []).map((msg) => {
          const { senderId, text } = msg;
          return {
            firstName: senderId?.firstName,
            lastName: senderId?.lastName,
            text,
          };
        });
        setMessages(chatMessages);
      } catch (err) {
        toast.error("Failed to load chat messages");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !socket) return;

    socket.emit("joinChat", {
      firstName: userFirstName,
      lastName: userLastName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, lastName, text },
      ]);
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [userFirstName, userLastName, userId, targetUserId, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) {
      return;
    }

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col rounded-lg bg-base-300">
      <div className="p-5 border-b border-gray-600 flex items-center gap-3">
        <h1 className="font-bold text-xl">Chat</h1>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
          <span className="text-xs text-gray-400">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = user.firstName === msg.firstName;
            return (
              <div key={index} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                <div className="chat-header">{`${msg.firstName} ${msg.lastName}`}</div>
                <div className={`chat-bubble ${isMe ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-5 border-t border-gray-600 flex items-center gap-2 bg-base-200">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border border-gray-500 bg-transparent text-white rounded-full px-4 py-2 focus:outline-none focus:border-primary"
        />
        <button 
          onClick={sendMessage} 
          className="btn btn-primary rounded-full px-6"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
