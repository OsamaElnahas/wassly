import React from "react";
import { Link } from "react-router-dom";
// import styles from "./AccessCard.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUserPlus, faStore } from '@fortawesome/free-solid-svg-icons';
// import iconProp from '@fortawesome/free-solid-svg-icons';

export default function AccessCard({ link, title, iconProp }) {
  return (
    <>
      <Link
        to={link}
        className="rounded p-2 w-100 d-block fw-bolder"
        style={{ backgroundColor: "white" }}
      >
        <div className="d-flex align-items-center gap-2 justify-content-center">
          {iconProp && <FontAwesomeIcon icon={iconProp} />}
          <div className="fw-bold text-primary">{title}</div>
        </div>
      </Link>
    </>
  );
}
