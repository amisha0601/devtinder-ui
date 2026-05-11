import React, { useState } from "react";
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
  const [profileSaved, setProfileSaved] = useState(false);

  const dispatch = useDispatch();
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");
  const [activeWord, setActiveWord] = useState("");

  const saveProfile = async () => {
    setError("");
    setProfileSaved(false);

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
      setProfileSaved(true);

      setTimeout(() => {
        setProfileSaved(false);
      }, 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to update profile";

      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const handleSkillsChange = (e) => {
    const fullValue = e.target.value;
    setSkills(fullValue);

    const parts = fullValue.split(",");
    const lastPart = parts[parts.length - 1].trim();

    setActiveWord(lastPart);
  };

  const handleVerify = async () => {
    const confirmed = window.confirm(
      "Verify as a developer? This will add a verification badge to your profile.",
    );

    if (!confirmed) return;

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/verify",
        {},
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      toast.success("Successfully verified as developer!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Verification failed";

      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-base-content">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-content">
            <h2 className="text-2xl font-bold tracking-wide">Edit Profile</h2>
            <p className="text-sm opacity-80 mt-1">
              Keep your profile fresh and up-to-date for the developer
              community.
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label font-semibold text-xs tracking-wider uppercase text-base-content/70">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered focus:input-primary transition-all duration-200 text-base-content bg-base-100"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>

              <div className="form-control w-full">
                <label className="label font-semibold text-xs tracking-wider uppercase text-base-content/70">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered focus:input-primary transition-all duration-200 text-base-content bg-base-100"
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-xs tracking-wider uppercase text-base-content/70">
                Photo URL
              </label>
              <input
                type="text"
                value={photoUrl}
                className="input input-bordered focus:input-primary transition-all duration-200 text-base-content bg-base-100"
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label font-semibold text-xs tracking-wider uppercase text-base-content/70">
                  Age
                </label>
                <input
                  type="text"
                  value={age}
                  className="input input-bordered focus:input-primary transition-all duration-200 text-base-content bg-base-100"
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                />
              </div>

              <div className="form-control w-full">
                <label className="label font-semibold text-xs tracking-wider uppercase text-base-content/70">
                  Gender
                </label>
                <input
                  type="text"
                  value={gender}
                  className="input input-bordered focus:input-primary transition-all duration-200 text-base-content bg-base-100"
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Male / Female / Other"
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-xs tracking-wider uppercase text-base-content/70">
                Skills{" "}
                <span className="text-xs normal-case opacity-60">
                  (Separated with commas)
                </span>
              </label>

              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] items-center">
                {activeWord.length > 1 &&
                  TECH_STACK.filter((t) =>
                    t.toLowerCase().includes(activeWord.toLowerCase()),
                  )
                    .slice(0, 5)
                    .map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="badge badge-secondary badge-outline cursor-pointer py-3 px-3 hover:bg-secondary hover:text-white transition-all duration-150 text-xs font-medium"
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
                className="input input-bordered focus:input-primary border-secondary/40 transition-all duration-200 w-full text-base-content bg-base-100"
                onChange={handleSkillsChange}
              />
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold text-xs tracking-wider uppercase text-base-content/70">
                About
              </label>
              <textarea
                value={about}
                className="textarea textarea-bordered focus:textarea-primary min-h-[100px] transition-all duration-200 text-base-content bg-base-100"
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us a little bit about yourself, projects you've worked on, or what you're learning..."
              />
            </div>

            {error && (
              <div className="alert alert-error py-2.5 px-4 text-sm rounded-lg flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-base-200">
              <button
                className={`btn flex-1 transition-all duration-300 font-semibold ${
                  profileSaved ? "btn-success text-success-content" : "btn-primary text-primary-content"
                }`}
                onClick={saveProfile}
              >
                {profileSaved ? (
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Profile Saved
                  </span>
                ) : (
                  "Save Profile"
                )}
              </button>

              {!user.isVerifiedDev && (
                <button
                  className="btn btn-outline btn-secondary font-semibold"
                  onClick={handleVerify}
                >
                  Verify as Developer
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-8 flex flex-col items-center lg:items-start">
          <div className="mb-4 text-center lg:text-left self-center lg:self-start px-2">
            <span className="badge badge-accent badge-sm uppercase tracking-wider font-bold mb-1">
              Live Preview
            </span>
            <p className="text-xs text-base-content/60">
              This is how other users see your profile.
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto lg:mx-0 hover:scale-[1.02] transition-transform duration-300">
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
        </div>
      </div>
    </div>
  );
};

export default EditProfile;