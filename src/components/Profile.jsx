import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="min-h-screen bg-base-300/40 py-6">
      {user ? (
        <EditProfile user={user} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 font-medium">Loading user profile...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;