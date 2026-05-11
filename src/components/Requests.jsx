import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { toast } from "../utils/notification";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to review request");
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });

        dispatch(addRequests(res.data.data));
      } catch {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch]);

  if (loading && (!requests || requests.length === 0))
    return (
      <div className="text-center my-10 text-base-content">
        <h1 className="text-3xl mb-8 font-bold">Connection Requests</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <div className="flex justify-center my-10 px-4 text-base-content">
        <div className="card bg-base-300 w-full max-w-sm shadow-lg border border-base-content/5">
          <div className="card-body text-center">
            <h1 className="text-2xl mb-4 font-bold">No Requests 📭</h1>
            <p className="text-base-content/70">Check back later for connection requests</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="text-center my-10 px-4 text-base-content">
      <h1 className="text-3xl mb-8 font-bold">Connection Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;

          return (
            <div
              key={_id}
              className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg bg-base-300 w-full max-w-2xl mx-auto shadow-md border border-base-content/5 gap-4"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 grow">
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full object-cover border border-base-content/10"
                  src={photoUrl}
                />
                <div className="text-center sm:text-left">
                  <h2 className="font-bold text-xl">
                    {firstName + " " + lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-base-content/70 text-sm font-medium">
                      {age + ", " + gender}
                    </p>
                  )}
                  <p className="text-sm text-base-content/80 mt-1">{about}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className="btn btn-outline btn-error flex-1 sm:flex-none"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-success text-success-content flex-1 sm:flex-none"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;