// src/components/Orders.js
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faPlusCircle,
  faBan,
  faCartArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import AddOrder from "./AddOrder";

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
  const [AddOrderPopUp, setAddOrderPopUp] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue.trim());
    }
  };

  return (
    <>
      <div
        className="item px-3 py-2 fw-bold pointer rounded-pill  align-items-center justify-content-center gap-2 d-flex my-3 d-lg-none "
        onClick={() => setAddOrderPopUp(true)}
        style={{
          fontSize: "0.9rem",

          opacity: 0.8,
          cursor: "pointer",
          width: "fit-content",
          marginLeft: "auto",
          backgroundColor: "white",
          border: "1px solid var(--mainColor)",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          color: "var(--mainColor)",
        }}
      >
        <FontAwesomeIcon icon={faPlusCircle} className="fs-5" />
        <span className="">Add Order</span>
      </div>

      {/* Tabs + Search */}
      <div
        className="row rounded-4  p-0 "
        style={{
          marginBottom: "1rem",
          backgroundColor: "white",
          color: "var(--sidebarBg)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="row align-items-center bg-white rounded-pill m-0 px-3 pt-2">
          {/* Tabs */}
          <div className="col-12 col-lg-5 d-flex align-items-center justify-content-around gap-3 p-0">
            {" "}
            <NavLink
              to="/orders/active"
              className="item p-2 mb-lg-0 fw-bold pointer d-flex justify-content-center align-items-center gap-2 w-100"
              style={({ isActive }) => ({
                borderBottom: isActive ? "4px solid var(--mainColor)" : "",
                color: isActive ? "var(--mainColor)" : "var(--sidebarBg)",
                transition: "border 0.2s ease",
              })}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  backgroundColor: "var(--secondaryColor)",
                  borderRadius: "50%",
                  color: "var(--mainColor)",
                  fontSize: "14px",
                  padding: "5px 6px",
                }}
              >
                <FontAwesomeIcon icon={faCartArrowDown} className="fs-5" />
              </span>
              <span>Active Orders</span>
            </NavLink>
            <NavLink
              to="/orders/cancelation"
              className="item p-2 mb-lg-0 fw-bold pointer  d-flex justify-content-center align-items-center gap-2 w-100"
              style={({ isActive }) => ({
                borderBottom: isActive ? "4px solid var(--mainColor)" : "",
                color: isActive ? "var(--mainColor)" : "var(--sidebarBg)",
                transition: "border 0.2s ease",
              })}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  backgroundColor: "var(--secondaryColor)",
                  borderRadius: "50%",
                  color: "var(--mainColor)",
                  fontSize: "14px",
                  padding: "5px 6px",
                }}
              >
                <FontAwesomeIcon icon={faBan} className="fs-5" />
              </span>
              <span>Cancelation Requests</span>
            </NavLink>
          </div>

          {/* Search + History + Add Order */}
          <div className="col-12 col-lg-7 d-flex align-items-center justify-content-between gap-3 py-2 py-lg-0 mb-1">
            <div
              className="search-container d-flex align-items-center gap-2  p-1 px-2 rounded-pill bg-white position-relative flex-grow-1"
              style={{ boxShadow: "0 1px 5px rgba(0, 0, 0, 0.099)" }}
            >
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  color: "var(--mainColor)",
                  fontSize: "18px",
                }}
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
                  }}
                  style={{ color: "var(--mainColor)", fontSize: "16px" }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="d-flex align-items-center gap-2 ">
              {/* <NavLink
                to="history"
                className="item px-3 fw-bold pointer"
                style={({ isActive }) => ({
                  borderBottom: isActive ? "4px solid var(--mainColor)" : "",
                  color: isActive ? "var(--mainColor)" : "var(--sidebarBg)",
                })}
              >
                History
              </NavLink> */}

              <div
                className="item px-3 py-2 fw-bold pointer rounded-pill  align-items-center justify-content-center gap-2 d-none d-lg-flex"
                onClick={() => setAddOrderPopUp(true)}
                style={{
                  fontSize: "0.9rem",
                  // backgroundColor: "var(--mainColor)",
                  backgroundColor: "white",
                  border: "1px solid var(--mainColor)",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",

                  color: "var(--mainColor)",
                  opacity: 0.8,
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} className="fs-5" />
                Add Order
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {AddOrderPopUp && <AddOrder onClose={() => setAddOrderPopUp(false)} />}

      <Outlet context={{ searchTerm, setSearchTerm }} />
    </>
  );
}
