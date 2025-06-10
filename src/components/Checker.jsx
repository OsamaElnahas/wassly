import React from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CheckStatus({ status }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3">
      <motion.div
        className="d-flex align-items-center justify-content-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {status === "loading" && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <FaSpinner size={60} style={{ color: "#4880FF" }} />
          </motion.div>
        )}
        {status === "success" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <FaCheckCircle size={60} style={{ color: "#28a745" }} />
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <FaTimesCircle size={60} style={{ color: "#dc3545" }} />
          </motion.div>
        )}
      </motion.div>
      <div className="fs-4 fw-semibold text-center">
        {status === "loading"
          ? "Loading..."
          : status === "success"
          ? "Done Successfully"
          : "Failed"}
      </div>
    </div>
  );
}
