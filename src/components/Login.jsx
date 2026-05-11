
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!emailId || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(emailId)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data || "Login failed. Please try again.";
      setError(errorMsg);
    }
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !emailId || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(emailId)) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      return navigate("/");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data || "Signup failed. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <div className="flex justify-center my-10 text-base-content">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-base-content font-bold text-2xl">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2> 

          <div>
            {!isLoginForm && (
              <>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-base-content/80 font-medium">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs text-base-content bg-base-100"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setError("");
                    }}
                  />
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-base-content/80 font-medium">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full max-w-xs text-base-content bg-base-100"
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setError("");
                    }}
                  />
                </label>
              </>
            )}

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/80 font-medium">Email Id</legend>
              <input
                type="text"
                value={emailId}
                className="input text-base-content bg-base-100"
                onChange={(e) => {
                  setEmailId(e.target.value);
                  setError("");
                }}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/80 font-medium">Password</legend>
              <input
                type="password"
                value={password}
                className="input text-base-content bg-base-100"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
            </fieldset>
          </div>

          <p className="text-error text-center mt-2 min-h-[24px] font-medium">{error}</p>

          <div className="card-actions justify-center">
            <button
              className="btn btn-primary text-primary-content font-semibold px-8"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>

          <p
            className="m-auto cursor-pointer py-2 text-sm text-info hover:underline transition-all"
            onClick={() => {
              setIsLoginForm((value) => !value);
              setError("");
            }}
          >
            {isLoginForm
              ? "New User? Signup Here"
              : "Existing User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;