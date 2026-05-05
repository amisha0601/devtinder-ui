import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";


const AppRoutes = () => {
  const user = useSelector((store) => store.user);

  return (
    <Routes>
      <Route path="/" element={<Body />}>

        <Route index element={user ? <Feed /> : <Login />} />

        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="connections" element={<Connections />} />
        <Route path="requests" element={<Requests />} />
        <Route path="premium" element={<Premium />} />
        <Route path="chat/:targetUserId" element={<Chat />} />

      </Route>
    </Routes>
  );
};


function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;