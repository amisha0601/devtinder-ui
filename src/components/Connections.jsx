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
      <div className="text-center my-10 text-base-content">
        <h1 className="text-3xl mb-8 font-bold">Connections</h1>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );

  if (!connections) return null;
  if (connections.length === 0)
    return (
      <div className="flex justify-center my-10 px-4">
        <div className="card bg-base-300 w-full max-w-sm shadow-lg border border-base-content/10 text-base-content">
          <div className="card-body text-center">
            <h1 className="text-2xl mb-4 font-bold">No Connections Yet 👥</h1>
            <p className="text-base-content/70">Connect with developers to start chatting!</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="text-center my-10 px-4 text-base-content">
      <h1 className="font-bold text-3xl mb-8">Connections</h1>

      <div className="space-y-4">
        {connections.map((connection) => {
          const user = connection.user || connection;
          const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

          const isOnline = onlineUsers.some(id => String(id) === String(_id));

          return ( 
            <div
              key={_id}
              className="flex flex-col sm:flex-row p-4 rounded-lg bg-base-300 w-full max-w-2xl mx-auto items-center gap-4 shadow-md border border-base-content/5"
            >
              <div className="relative shrink-0">
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full object-cover border border-base-content/10"
                  src={photoUrl}
                />
                {isOnline && (
                  <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-base-300 animate-pulse"></div>
                )}
              </div>

              <div className="text-center sm:text-left mx-2 grow">
                <h2 className="font-bold text-xl text-base-content">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && <p className="text-base-content/70 text-sm font-medium">{age + ", " + gender}</p>}
                <p className="text-sm text-base-content/80 mt-1">{about}</p>
              </div>

              <Link to={"/chat/" + _id} className="w-full sm:w-auto">
                <button className="btn btn-primary px-6 w-full sm:w-auto text-primary-content">Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;