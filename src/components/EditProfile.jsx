import React from "react";
import { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL, TECH_STACK } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const saveProfile = async () => {
    setError("");
    try {
      // 1. Logic to turn the string "React, Node" into a clean Array ["React", "Node"]
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills: skillsArray, // 2. Send the cleaned array to the backend
        },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      // Helpful Tip: If your backend sends a string error, use this.
      // If it's an object, you might need err.response.data.message
      setError(err.response?.data || "Something went wrong");
    }
  };

  const [activeWord, setActiveWord] = useState("");

  const handleSkillsChange = (e) => {
    const fullValue = e.target.value;
    setSkills(fullValue);

    // 2. Logic: Find what the user is typing right now (after the last comma)
    const parts = fullValue.split(",");
    const lastPart = parts[parts.length - 1].trim();

    setActiveWord(lastPart);
  };

  const [error, setError] = useState("");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");

  const handleVerify = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/verify",
        {},
        { withCredentials: true },
      );
      // Update the Redux store with new user data
      dispatch(addUser(res?.data?.data));
      setShowToast(true); // Show success message
    } catch (err) {
      setError(err.response?.data || "Verification failed");
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div>
          <div className="flex justify-center mx-10">
            <div className="card card-dash bg-base-200 w-96">
              <div className="card-body">
                <h2 className="card-title justify-center">Edit Profile</h2>
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">First Name</legend>
                    <input
                      type="text"
                      value={firstName}
                      className="input"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Last Name</legend>
                    <input
                      type="text"
                      value={lastName}
                      className="input"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">PhotoUrl</legend>
                    <input
                      type="text"
                      value={photoUrl}
                      className="input"
                      onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Age</legend>
                    <input
                      type="text"
                      value={age}
                      className="input"
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Gender</legend>
                    <input
                      type="text"
                      value={gender}
                      className="input"
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Skills (Separate with commas)
                    </legend>

                    {/* 1. THE SUGGESTION BAR - Shows when user starts typing a new skill */}
                    <div className="flex flex-wrap gap-2 mb-2 min-h-8">
                      {activeWord.length > 1 &&
                        TECH_STACK.filter((t) =>
                          t.toLowerCase().includes(activeWord.toLowerCase()),
                        )
                          .slice(0, 5) // Show top 5 matches
                          .map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              className="badge badge-secondary badge-outline cursor-pointer hover:bg-secondary hover:text-white transition-all"
                              onClick={() => {
                                const parts = skills.split(",");
                                // Replace the last part with the clicked suggestion
                                parts[parts.length - 1] = " " + suggestion;
                                setSkills(parts.join(",") + ", "); // Add a comma for the next one
                                setActiveWord(""); // Clear suggestions
                              }}
                            >
                              + {suggestion}
                            </button>
                          ))}
                    </div>

                    {/* 2. THE INPUT FIELD */}
                    <input
                      type="text"
                      value={skills}
                      placeholder="React, Node, MongoDB..."
                      className="input w-full border-secondary focus:border-primary"
                      onChange={handleSkillsChange}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">About</legend>
                    <input
                      type="text"
                      value={about}
                      className="input"
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </fieldset>
                </div>
                <p className="text-red-500">{error}</p>
                <div className="card-actions justify-center">
                  <button className="btn btn-primary" onClick={saveProfile}>
                    Save Profile
                  </button>
                  {!user.isVerifiedDev && (
                    <button
                      className="btn btn-outline btn-secondary mt-4"
                      onClick={handleVerify}
                    >
                      Verify as Developer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
            skills, // Added this: now the preview sees your skills as you type!
            isVerifiedDev: user.isVerifiedDev, // Added this: now the preview sees the badge status!
          }}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
