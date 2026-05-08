import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { toast } from "../utils/notification";

const UserCard = ({ user }) => {
  const userData = user?.user ? user.user : user;

  const { 
    _id, 
    firstName, 
    lastName, 
    photoUrl, 
    age, 
    gender, 
    about, 
    skills, 
    isVerifiedDev 
  } = userData;

  const dispatch = useDispatch();

  const onlineUsers = useSelector((store) => store.presence);
  const isOnline = onlineUsers.some(
    (onlineId) => String(onlineId) === String(_id)
  );

  const skillsArray =
    typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter((s) => s !== "")
      : skills;

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong";

      if (message === "Connection Request Already Exists!!") {
        dispatch(removeUserFromFeed(userId));
      }

      toast.error(message);
      console.error("Request Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-sm border border-gray-700">
      <figure className="relative">
        <img
          src={photoUrl}
          alt="userPhoto"
          className="h-64 w-full object-cover"
        />

        {isOnline && (
          <div className="absolute top-4 right-4 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse z-10"></div>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {firstName + " " + lastName}
          {isVerifiedDev && (
            <div className="badge badge-secondary gap-2 ml-2 py-3 px-2">
              <span className="text-xs font-bold">Verified Dev</span>
            </div>
          )}
        </h2>

        {age && gender && (
          <p className="text-gray-400">{age + ", " + gender}</p>
        )}
        <p className="line-clamp-3">{about}</p>

        <div className="flex flex-wrap gap-2 my-2">
          {skillsArray &&
            skillsArray.map((skill, index) => (
              <div
                key={index}
                className="badge badge-outline badge-sm uppercase font-mono text-xs"
              >
                {skill}
              </div>
            ))}
        </div>

        {!user?.user && _id && (
          <div className="card-actions justify-center mt-4 gap-4">
            <button
              className="btn btn-outline btn-primary px-8"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary px-8"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;