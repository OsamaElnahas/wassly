import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faSearch,
  faUserCircle,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import AccessCard from "../AccessCard/AccessCard";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import Errors from "../Error/Errors";
import RechargeCoin from "./ChargeCoins";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";

export default function Tayareen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // Track input for typing
  const [showChargePopUp, setChargePopUp] = useState(false);
  const [selectedTayar, setSelectedTayar] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const baseUrl = useSelector(selectBaseUrl);

  async function getTayareen() {
    try {
      const params = {
        page,
        page_size: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      const res = await axios.get(`${baseUrl}api/crews/`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
        params,
      });
      console.log("Fetched Tayars:", res.data);
      return res?.data || { data: [] };
    } catch (error) {
      console.error("Error fetching Tayars:", error);
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Tayareen", page, searchTerm, pageSize],
    queryFn: getTayareen,
    keepPreviousData: true,
    staleTime: 1000, // Prevent rapid refetches
  });

  if (isError) {
    if (!error.response)
      return <Errors errorMessage="No Internet Connection" />;
    const status = error.response.status;
    if (status === 401 || status === 403)
      return <Errors errorMessage="Unauthorized Access" />;
    if (status === 404) return <Errors errorMessage="Not Found" />;
    if (status >= 500)
      return <Errors errorMessage="Server Error, Please Try Again;" />;
    return <Errors errorMessage={`Error: ${error.message}`} />;
  }

  // const data?.data = data?.data || [];

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

  return (
    <div
      className="px-2  d-flex flex-column  justify-content-center  w-100"
      style={{ maxWidth: "1500px", margin: "0 auto" }}
    >
      <div
        className="row g-0  align-items-center w-100 justify-content-between "
        style={{ margin: "0 auto" }}
      >
        <div className="col-md-6 col-lg-2 col-sm-6 col-7 mb-4 ">
          <NavLink
            to={"/tayareen/addTayar"}
            className="item px-3 py-2 fw-bold pointer rounded-pill  align-items-center justify-content-center gap-2  d-flex"
            // onClick={() => setAddOrderPopUp(true)}
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
            <FontAwesomeIcon icon={faUserPlus} className="fs-5" />
            <span>Add Tayar</span>
          </NavLink>
        </div>

        <div className="col-md-6 col-lg-5 col-sm-6 col-12 mb-4 ">
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
              placeholder="Search by Tayar name, Tayar Phone  (Press Enter)"
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
        </div>
      </div>
      {isLoading && <Loader />}
      <div
        className="my-4"
        style={{ fontWeight: "800", color: "var(--mainColor)" }}
      >
        Tayareen ({data?.count || 0})
      </div>

      <div className="row g-2 g-md-3">
        {isError && (
          <Errors
            message={
              error.response?.data?.message ||
              error.message ||
              "No Internet Connection"
            }
          />
        )}
        {data?.data.length > 0 && !isLoading ? (
          data?.data.map((tayar) => (
            <div className="col-sm-12 col-lg-6" key={tayar.id}>
              <div
                className="bg-white rounded p-3 shadow-sm border position-relative overflow-hidden"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <NavLink
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "var(--mainColor)",
                    }}
                    to={`/tayareen/tayaarDetails/${tayar.id}`}
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-white fs-1 w-100"
                    />
                  </NavLink>
                  <div className="flex-grow-1 overflow-hidden d-flex flex-column gap-2">
                    <div className="fw-bold text-truncate text-dark">
                      {tayar.username}
                    </div>
                    <div className="text-muted small">{tayar.phone_number}</div>
                    <div className="text-primary small fw-semibold">
                      {" "}
                      {tayar.crew_type}
                    </div>
                    <div className="text-muted small">
                      {tayar.is_active ? "Active" : "Inactive"}
                    </div>
                    {/* <div className="d-flex align-items-center gap-3 justify-content-between"> */}
                    <div className="d-flex justify-content-between align-items-center gap-5 ">
                      <div className="text-muted small">
                        Balance: {tayar.balance} EGP
                      </div>
                      <button
                        className="btn px-4 py-1 rounded-3 shadow-sm  d-flex align-items-center"
                        onClick={() => {
                          setSelectedTayar({
                            id: tayar.id,
                            username: tayar.username,
                          });
                          setChargePopUp(true);
                        }}
                        style={{
                          backgroundColor: "var(--mainColor)",
                          color: "white",
                          border: "none",
                          transition:
                            "background-color 0.3s ease, transform 0.3s ease",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                        Charge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            // </div>
          ))
        ) : isLoading ? (
          <Loader />
        ) : (
          data?.data.length == 0 && (
            <div className="col-12">
              <p
                className="text-center text-muted"
                style={{ fontSize: "16px", fontWeight: "600" }}
              >
                {searchTerm
                  ? `No Tayareen found for "${searchTerm}"`
                  : "No Tayareen found"}
              </p>
            </div>
          )
        )}
      </div>

      {showChargePopUp && selectedTayar && (
        <RechargeCoin
          id={selectedTayar.id}
          username={selectedTayar.username}
          onClose={() => {
            setChargePopUp(false);
            setSelectedTayar(null);
          }}
        />
      )}

      {data?.data?.length > 0 && (
        <div
          className="pagination-controls mt-4 d-flex justify-content-center align-items-center gap-3"
          style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
        >
          <button
            className="btn btn-outline-primary"
            style={{
              width: "120px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid var(--mainColor)",
              color: "var(--mainColor)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "var(--mainColor)",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            Page {page}
          </span>
          <button
            className="btn btn-outline-primary"
            style={{
              width: "120px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid var(--mainColor)",
              color: "var(--mainColor)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data?.next || data?.length < pageSize}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
