import React, { useState, useEffect } from "react";
import PasswordPrompt from "../PasswordPrompet/PasswordPrompet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function Analytics() {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const sessionAccess = sessionStorage.getItem("analyticsAccess");
    if (sessionAccess === "true") {
      setHasAccess(true);
    }
  }, []);

  const handleSuccess = () => {
    sessionStorage.setItem("analyticsAccess", "true");
    setHasAccess(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("analyticsAccess");
    setHasAccess(false);
  };

  if (!hasAccess) {
    return <PasswordPrompt onSuccess={handleSuccess} />;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-end align-items-center">
        <button
          className="btn btn-primary d-flex align-items-center gap-2 justify-content-center"
          style={{
            width: "5rem",
          }}
          onClick={handleLogout}
        >
          {/* <FontAwesomeIcon icon={faXmark} /> */}
          Close
        </button>
      </div>
      <section className="analytics-section mt-4 bg-white p-4 rounded-3 shadow-md">
        <div>Welcome to the Analytics Page</div>
      </section>
    </div>
  );
}
