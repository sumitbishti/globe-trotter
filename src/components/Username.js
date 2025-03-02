"use client";
import { useState } from "react";
import User from "../models/User";

const Username = ({ username, setUsername }) => {
  const [error, setError] = useState("");

  const validateUser = async () => {
    const saved_user = await User.findOne({ name: username });
    console.log("saved_user: ", saved_user);

    if (saved_user) {
      setError("User Already exists. Try another user name");
      return;
    }
  };

  const handleUsername = (e) => {
    e.preventDefault();
    const user = e.target.value.trim();
    console.log("user", user);
    setUsername(user);
  };
  const handleClick = (e) => {
    e.preventDefault()
    console.log('onclick', username)

    validateUser()
  };

  return (
    <div className="bg-red-200 p-8 rounded-lg">
      <form className="flex gap-2">
        <label>Enter a Unique Username:</label>
        <input
          value={username}
          onChange={handleUsername}
          type="text"
          required
          className="outline-none rounded-md"
        />
        <button
          className="bg-accent rounded-lg py-1 px-2"
          type="submit"
          onClick={handleClick}
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default Username;
