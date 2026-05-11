import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { toast } from "../utils/notification";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getFeed = async () => {
      if (feed && feed.length > 0) return;

      setLoading(true);
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });

        const feedData = res?.data?.data || res?.data;
        dispatch(addFeed(feedData));
      } catch (err) {
        toast.error("Failed to load feed. Please try again.");
        console.error("Feed Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, [dispatch, feed]);

  if (loading)
    return (
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-xl animate-pulse">
          <div className="card-body">
            <div className="h-64 bg-base-content/20 rounded mb-4"></div>
            <div className="h-6 bg-base-content/20 rounded mb-2"></div>
            <div className="h-4 bg-base-content/20 rounded mb-4"></div>
            <div className="h-10 bg-base-content/20 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (!feed) return null;

  if (feed.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-base-content text-2xl font-semibold">
         No new users found!
      </h1>
    );

  return (
    <div className="flex justify-center items-center my-10 px-4">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;