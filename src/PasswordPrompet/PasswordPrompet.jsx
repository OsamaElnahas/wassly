import React, { useState } from "react";

const PasswordPrompt = ({ onSuccess }) => {
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "200319";
    if (inputPassword === correctPassword) {
      onSuccess();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div
      className="password-modal bg-white rounded-3 shadow-lg"
      style={{ padding: "2rem" }}
    >
      <form onSubmit={handleSubmit}>
        <label>Enter Password:</label>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          className="form-control my-2"
        />
        <button className="btn btn-primary my-2" type="submit">
          Submit
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default PasswordPrompt;
