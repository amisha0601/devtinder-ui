import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests,removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
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
      <div className="text-center my-10">
        <h1 className="text-white text-3xl mb-8">Connection Requests</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-lg">
          <div className="card-body text-center">
            <h1 className="text-2xl text-white mb-4">No Requests 📭</h1>
            <p className="text-gray-400">Check back later for connection requests</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="text-center my-10">
      <h1 className="text-white text-3xl mb-8">Connection Requests</h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;

        return (
          <div
            key={_id}
            className=" flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-4 grow">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p className="text-gray-400">{age + ", " + gender}</p>}
              <p className="text-sm text-gray-300">{about}</p>
            </div>
            <div>
             <button
                className="btn btn-outline btn-error mx-2"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-success mx-2"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Requests;