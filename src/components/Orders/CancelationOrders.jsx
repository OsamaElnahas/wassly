import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faCheckSquare,
  faTimes,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function CancelationOrders() {
  return (
    <div
      className="px-3 px-sm-2 d-flex flex-column  justify-content-center gap-1 w-100"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
    >
      {/* Cancellation Requests Section */}
      <div
        className="fw-bold mb-4"
        style={{ color: "var(--mainColor)", fontSize: "1rem" }}
      >
        Cancellation Requests (2)
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div
            className="cancellation-card bg-white rounded p-3 h-100"
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              borderLeft: "4px solid red",
            }}
          >
            {/* Card Header */}
            <div
              className="card-header d-flex align-items-center mb-3 pb-3"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <img
                src="https://placehold.co/60x60"
                alt="Delivery crew member"
                className="delivery-crew-image rounded-circle me-3"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                }}
              />
              <div className="crew-info flex-grow-1">
                <div className="d-flex align-items-center justify-content-between">
                  <h6
                    className="mb-1 fw-bold"
                    style={{ color: "var(--mainColor)" }}
                  >
                    John Doe
                  </h6>
                  <span className="badge bg-warning text-dark">Pending</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-muted" />
                  <a
                    href="tel:+1234567890"
                    className="text-decoration-none"
                    style={{ color: "var(--mainColor)" }}
                  >
                    +1234567890
                  </a>
                </div>
              </div>
            </div>

            {/* Reason Section */}
            <div className="reason-section mb-3">
              <label className="fw-bold mb-2 d-block">
                Cancellation Reason
              </label>
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  minHeight: "80px",
                }}
              >
                Customer unavailable at the delivery address. Customer
                unavailable at the delivery address. Customer unavailable at the
                delivery address. Customer unavailable at the delivery address.
                Customer unavailable at the delivery address. Customer
                unavailable at the delivery address.
              </div>
            </div>

            {/* Order Info */}
            <div className="order-info mb-4">
              <div className="row">
                <div className="col-6">
                  <small className="text-muted d-block">Order Code</small>
                  <strong>ORD12345</strong>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Requested At</small>
                  <strong>2025-08-20 | 10:30 AM</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="buttons-container d-flex justify-content-end w-100 ">
              <div className="action-buttons d-flex gap-4 ">
                <button
                  className="btn btn-success flex-fill  rounded-3 px-4"
                  style={{
                    backgroundColor: "#28b363",
                    border: "none",
                    padding: "10px",
                    width: "fit-content",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    className="me-2 bg-success"
                  />
                  Accept
                </button>
                <button
                  className="btn btn-danger flex-fill rounded-3 px-3"
                  style={{
                    border: "none",
                    padding: "10px",
                    width: "fit-content",
                    backgroundColor: "##bc372a",
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-2 bg-danger" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Example */}
      <div className="text-center py-4 mt-4">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-success mb-3"
          style={{ fontSize: "3rem" }}
        />
        <p className="text-muted">No pending cancellation requests</p>
      </div>
    </div>
  );
}
