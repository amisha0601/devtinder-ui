import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
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
  } = user;

  const dispatch = useDispatch();

  const skillsArray = typeof skills === "string" 
    ? skills.split(",").map(s => s.trim()).filter(s => s !== "") 
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
      console.error("Request Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure>
        <img 
            src={photoUrl} 
            alt="userPhoto" 
            className="h-64 w-full object-cover"
        />
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

        {age && gender && <p className="text-gray-400">{age + ", " + gender}</p>}
        
        <p className="line-clamp-3">{about}</p>

        <div className="flex flex-wrap gap-2 my-2">
          {skillsArray && skillsArray.length > 0 ? (
            skillsArray.map((skill, index) => (
              <div 
                key={index} 
                className="badge badge-outline badge-sm uppercase font-mono text-xs"
              >
                {skill}
              </div>
            ))
          ) : (
            <p className="text-xs italic text-gray-500">No skills added yet</p>
          )}
        </div>

        {_id && (  <div className="card-actions justify-center mt-4 gap-4">
          <button
            className="btn btn-primary px-8"
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
        </div>)}
      </div>
    </div>
  );
};

export default UserCard;