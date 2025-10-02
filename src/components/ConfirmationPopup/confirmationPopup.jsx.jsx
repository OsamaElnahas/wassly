import React, { useEffect } from "react";
import CheckStatus from "../Checker";

export default function ConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  status = "null", 
}) {
  // Escape key handler
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        animation: "fadeIn 0.3s ease-in-out",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="popup-content shadow-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          minHeight: "300px",
          animation: "slideUp 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        {title && <h4 className="mb-3 fw-bold">{title}</h4>}
        {status !== "success" && (
          <div
            className="mb-4 text-muted fw-bold"
            style={{ fontSize: "1.2rem" }}
          >
            {description}
          </div>
        )}
        {status !== "null" && (
          <div className="d-flex justify-content-center align-items-center mb-3">
            <CheckStatus status={status} />
          </div>
        )}
        <div className="btns d-flex justify-content-center mt-5 align-self-end align-items-center gap-3 mt-3 w-50">
          {status !== "success" && (
            <button
              className="btn btn-primary w-100"
              onClick={handleConfirm}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              {confirmText}
            </button>
          )}
          <button className="btn btn-secondary w-100" onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
