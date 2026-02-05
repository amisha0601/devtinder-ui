import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<div>Base Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/test" element={<div>Test Page</div>} />
        </Routes>
      </BrowserRouter>
      {/* <Navbar /> */}
      {/* <h1 class="text-3xl font-bold underline text-indigo-200">Hello world!</h1> */}
    </>
  );
}

export default App;
