// components/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light text-center">
      <h1 className="display-1 text-primary mb-4">404</h1>
      <p className="h5 text-secondary mb-4">Oops! Page not found.</p>
      <Link
        to="/"
        className="btn btn-primary btn-lg px-5"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
