// src/components/Orders.js
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddOrder from "./AddOrder";
import CancelationOrders from "./CancelationOrders";
import ActiveOrders from "./ActiveOrders";

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, "0");
  return `${day}-${month}-${year} | ${hours}:${minutes} ${ampm}`;
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [tab, setTab] = useState("Active Orders");
  const [AddOrderPopUp, setAddOrderPopUp] = useState(false);
  const [page, setPage] = useState(1);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

  return (
    <>
      <div
        className="item px-3 py-2 fw-bold pointer rounded-3  align-items-center justify-content-center gap-2 d-md-flex my-3 d-md-none "
        onClick={() => setAddOrderPopUp(true)}
        style={{
          fontSize: "0.9rem",
          backgroundColor: "var(--mainColor)",
          color: "white",
          opacity: 0.8,
          cursor: "pointer",
          width: "fit-content",
          marginLeft: "auto",
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        Add Order
      </div>
      <div
        className="row rounded-2 pt-5 gx-3 mb-4"
        style={{
          marginBottom: "1rem",
          // padding: "1rem",
          backgroundColor: "white",
          color: "var(--sidebarBg)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          // borderTop: "3px solid var(--mainColor)",
          // maxWidth: "1435px",
        }}
      >
        <div className="col-12">
          <h3 className="text-center fw-bold">Orders Management</h3>
          <p className="text-center" style={{ fontSize: "16px" }}>
            Manage and track all your orders efficiently
          </p>
        </div>
        <div className="row align-items-center bg-light rounded-2 m-0">
          {/* Left side (smaller width) */}
          <div className="col-12 col-md-4 d-flex align-items-center gap-3">
            <div
              className="item p-4 fw-bold pointer"
              style={{
                fontSize: "0.9rem",
                cursor: "pointer",
                borderBottom:
                  tab === "Active Orders"
                    ? "4px solid var(--mainColor)"
                    : "none",
              }}
              onClick={() => setTab("Active Orders")}
            >
              Active Orders
            </div>
            <div
              className="item p-4 fw-bold pointer"
              style={{
                fontSize: "0.9rem",
                cursor: "pointer",
                borderBottom:
                  tab === "Cancelation Requests"
                    ? "4px solid var(--mainColor)"
                    : "none",
              }}
              onClick={() => setTab("Cancelation Requests")}
            >
              Cancelation Requests
            </div>
          </div>

          {/* Right side (larger width) */}
          <div className="col-12 col-md-8 d-flex align-items-center justify-content-between gap-3">
            {/* Search box takes most of right side */}
            <div className="search-container d-flex align-items-center gap-2 border p-1 px-1 rounded bg-white position-relative flex-grow-1">
              <FontAwesomeIcon
                icon={faSearch}
                style={{ color: "var(--mainColor)", fontSize: "18px" }}
              />
              <input
                className="w-100 border-0 p-1"
                type="text"
                placeholder="Search by Receiver name, Receiver Phone or Order Code"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ outline: "none", paddingRight: "40px" }}
                aria-label="Search orders"
              />
              {inputValue && (
                <button
                  className="btn btn-sm p-0 position-absolute end-0 me-2 d-flex fs-3 text-primary"
                  onClick={() => {
                    setInputValue("");
                    setSearchTerm("");
                    setPage(1);
                  }}
                  style={{ color: "var(--mainColor)", fontSize: "16px" }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* History + Add Order */}
            <div className="d-flex align-items-center gap-2 ">
              <div
                className="item p-4 fw-bold pointer "
                style={{
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  borderBottom:
                    tab === "History" ? "4px solid var(--mainColor)" : "none",
                }}
                onClick={() => setTab("History")}
              >
                History
              </div>
              <div
                className="item px-3 py-2 fw-bold pointer rounded-3  align-items-center justify-content-center gap-2 d-none d-md-flex"
                onClick={() => setAddOrderPopUp(true)}
                style={{
                  fontSize: "0.9rem",
                  backgroundColor: "var(--mainColor)",
                  color: "white",
                  opacity: 0.8,
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Order
              </div>
            </div>
          </div>
        </div>
      </div>
      {AddOrderPopUp && (
        <AddOrder onClose={() => setAddOrderPopUp(!AddOrderPopUp)} />
      )}

      {tab == "Active Orders" && (
        <ActiveOrders searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}

      {tab == "Cancelation Requests" && <CancelationOrders />}
    </>
  );
}
