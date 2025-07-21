import React, { useState } from "react";
import CheckStatus from "../Checker";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectBaseUrl } from '../../features/api/apiSlice';

const Popup = ({ message, onClose, onConfirm, username, isLoading, link, status,charge=false,id},) => {
  const showUserInfo = username;
  // const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // success | error | null
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const baseUrl = useSelector(selectBaseUrl);



const validateFloat = (value) => {
    const floatRegex = /^\d*\.\d+$/; // matches only float 
    return floatRegex.test(value);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validateFloat(amount)) {
    setError("Please enter a valid number (e.g., 12.5)");
    return;
  }

  setSubmitStatus("loading");

  try {
  const res = await axios.post(
    `${baseUrl}api/crews/recharge/${id}`,
    { amount: amount },
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );

  setSubmitStatus("success");
  queryClient.invalidateQueries(["tayareen", id]); 
  console.log("API response:", res.data);
} catch (err) {
  setSubmitStatus("error");
  console.error(err);
}

};



  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="bg-white rounded-4 p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        {isLoading && <CheckStatus status={"loading"} />}
{/* // If charge is true, display a message and buttons */}
        {message && (
          <p className="fs-5 fw-semibold  text-center" style={{
            color: "var(--mainColor)",
            marginBottom: "20px",
          }}>{message}</p>
        )}
{/* // If username is provided, display user info and Done button */}
        {showUserInfo && (
          <>
            <CheckStatus status={isLoading ? "loading" : "success"} />
            <div className="text-dark d-flex flex-column gap-2 mt-3">
              <p>
                <span className="fw-bold text-primary">Username:</span> {username}
              </p>
              {/* <p>
                <span className="fw-bold text-primary">Password:</span> {password}
              </p> */}
              <Link
                to={link}
                onClick={onClose}
                className="btn btn-warning mt-3 w-100 text-dark fw-semibold"
              >
                Done
              </Link>
            </div>
          </>
        )}


{/* // If status is provided, display the status and Done button */}
        {status !== undefined && (
          <>
            <CheckStatus status={status === true ? "success" : "error"} />
            <button
              onClick={onClose}
              className="btn btn-primary mt-4 w-100 fw-semibold"
            >
              Done
            </button>
          </>
        )}
    {/* If message is provided and user info is not shown, display confirm and close buttons */}
{message && !showUserInfo && (
  <>
    {submitStatus ? (
      <div className="mt-3 d-flex flex-column align-items-center">
        <CheckStatus status={submitStatus} />
        {(submitStatus === "success" || submitStatus === "error") && (
          <button
            onClick={onClose}
            className="btn btn-primary mt-3 fw-semibold w-100"
          >
            Done
          </button>
        )}
      </div>
    ) : (
      <>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <input
            type="text"
            placeholder="Enter amount"
            className="p-2 w-100 rounded-3 outline-0 border-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {error && <div className="text-danger fw-semibold">{error}</div>}
        </form>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-100 fw-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Yes"}
          </button>

          <button
            onClick={onClose}
            className="btn btn-danger w-100 fw-semibold"
            disabled={isSubmitting}
          >
            Close
          </button>
        </div>
      </>
    )}
  </>
)}

      </div>
    </div>
  );
};

export default Popup;
