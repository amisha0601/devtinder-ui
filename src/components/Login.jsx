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
    <div className="flex justify-center my-8 text-base-content px-4">
      <div className="card bg-base-300 w-full max-w-md shadow-xl">
        <div className="card-body p-8">
          <h2 className="card-title justify-center text-base-content font-bold text-2xl mb-4 -mt-1">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2> 

          <div className="flex flex-col gap-3">
            {!isLoginForm && (
              <div className="flex gap-4 w-full">
                <div className="form-control flex-1">
                  <div className="label py-1">
                    <span className="label-text text-base-content/80 font-medium text-sm">First Name</span>
                  </div>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    className="input input-bordered w-full text-base-content bg-base-100 focus:input-primary"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setError("");
                    }}
                  />
                </div>

                <div className="form-control flex-1">
                  <div className="label py-1">
                    <span className="label-text text-base-content/80 font-medium text-sm">Last Name</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    className="input input-bordered w-full text-base-content bg-base-100 focus:input-primary"
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setError("");
                    }}
                  />
                </div>
              </div>
            )}

            <div className="form-control w-full">
              <div className="label py-1">
                <span className="label-text text-base-content/80 font-medium text-sm">Email Id</span>
              </div>
              <input
                type="text"
                placeholder="name@example.com"
                value={emailId}
                className="input input-bordered w-full text-base-content bg-base-100 focus:input-primary"
                onChange={(e) => {
                  setEmailId(e.target.value);
                  setError("");
                }}
              />
            </div>

            <div className="form-control w-full">
              <div className="label py-1">
                <span className="label-text text-base-content/80 font-medium text-sm">Password</span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                className="input input-bordered w-full text-base-content bg-base-100 focus:input-primary"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          <p className="text-error text-center min-h-[24px] text-sm font-medium">{error}</p>

          <div className="card-actions justify-center">
            <button
              className="btn btn-primary text-primary-content font-semibold w-full"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>

          <p
            className="-m-1 cursor-pointer pt-4 text-sm text-info hover:underline transition-all text-center"
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