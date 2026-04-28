import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const onlineUsers = useSelector((store) => store.presence); 
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0) return <h1 className="text-center my-10 text-white text-2xl"> No Connections Found</h1>;

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

            <div className="text-left mx-4 flex-grow">
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