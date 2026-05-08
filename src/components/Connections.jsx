import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { toast } from "../utils/notification";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const onlineUsers = useSelector((store) => store.presence); 
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      toast.error("Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-center my-10">
        <h1 className="text-white text-3xl mb-8">Connections</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );

  if (!connections) return null;
  if (connections.length === 0)
    return (
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-lg">
          <div className="card-body text-center">
            <h1 className="text-2xl text-white mb-4">No Connections Yet 👥</h1>
            <p className="text-gray-400">Connect with developers to start chatting!</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl mb-8">Connections</h1>

      {connections.map((connection) => {
        const user = connection.user || connection;
        const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

        const isOnline = onlineUsers.some(id => String(id) === String(_id));

        return ( 
          <div
            key={_id}
            className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto items-center"
          >
            <div className="relative">
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover"
                src={photoUrl}
              />
              {isOnline && (
                <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-base-300 animate-pulse"></div>
              )}
            </div>

            <div className="text-left mx-4 grow">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p className="text-gray-400">{age + ", " + gender}</p>}
              <p className="text-sm text-gray-300">{about}</p>
            </div>

            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary px-6">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;