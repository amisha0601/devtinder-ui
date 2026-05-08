import React from "react";
import { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL, TECH_STACK } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { toast } from "../utils/notification";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");

  const saveProfile = async () => {
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    if (age && isNaN(age)) {
      setError("Age must be a number");
      return;
    }

    try {
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
          skills: skillsArray,
        },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Failed to update profile";
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const [activeWord, setActiveWord] = useState("");

  const handleSkillsChange = (e) => {
    const fullValue = e.target.value;
    setSkills(fullValue);

    const parts = fullValue.split(",");
    const lastPart = parts[parts.length - 1].trim();

    setActiveWord(lastPart);
  };

  const handleVerify = async () => {
    const confirmed = window.confirm("Verify as a developer? This will add a verification badge to your profile.");
    if (!confirmed) return;

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/verify",
        {},
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Verification failed";
      toast.error(errorMsg);
      setError(errorMsg);
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

                    <div className="flex flex-wrap gap-2 mb-2 min-h-8">
                      {activeWord.length > 1 &&
                        TECH_STACK.filter((t) =>
                          t.toLowerCase().includes(activeWord.toLowerCase()),
                        )
                          .slice(0, 5) 
                          .map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              className="badge badge-secondary badge-outline cursor-pointer hover:bg-secondary hover:text-white transition-all"
                              onClick={() => {
                                const parts = skills.split(",");
                                parts[parts.length - 1] = " " + suggestion;
                                setSkills(parts.join(",") + ", "); 
                                setActiveWord(""); 
                              }}
                            >
                              + {suggestion}
                            </button>
                          ))}
                    </div>

                   
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
                  <button 
                    className="btn btn-primary" 
                    onClick={saveProfile}
                  >
                    Save Profile
                  </button>
                  {!user.isVerifiedDev && (
                    <button
                      className="btn btn-outline btn-secondary"
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
            skills,
            isVerifiedDev: user.isVerifiedDev,
          }}
        />
      </div>
    </>
  );
};

export default EditProfile;
