import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faMotorcycle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../Loader/Loader";
import Errors from "../Error/Errors";
import PasswordPrompt from "../../PasswordPrompet/PasswordPrompet";

export default function Transactions() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [filterTerm, setFilterTerm] = useState("All");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const sessionAccess = sessionStorage.getItem("transactionAccess");
    if (sessionAccess === "true") {
      setHasAccess(true);
    }
  }, []);

  const handleSuccess = () => {
    sessionStorage.setItem("transactionAccess", "true");
    setHasAccess(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("transactionAccess");
    setHasAccess(false);
  };

  // Fetch transactions using useQuery
  const fetchTransactions = async () => {
    try {
      const type =
        filterTerm === "All" ? "" : filterTerm.toLowerCase().replace(" ", "_");

      const params = {
        page,
        page_size: pageSize,
      };
      if (type) params.transaction_type = type;
      if (startDate) params.from = startDate;
      if (endDate) params.to = endDate;

      const res = await axios.get(
        "https://wassally.onrender.com/api/transactions/",
        {
          headers: { Authorization: "Token " + localStorage.getItem("token") },
          params,
        }
      );
      console.log("Transactions:", {
        page,
        params,
        data: res?.data?.data,
        next: res?.data?.next,
        count: res?.data?.count,
        length: res?.data?.data?.length,
      });
      return res?.data || { data: [] };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["transactions", page, filterTerm, startDate, endDate],
    queryFn: fetchTransactions,
    keepPreviousData: true,
  });

  const transactionStyles = {
    order_picked: { icon: faMotorcycle, color: "text-primary" },
    balance_recharged: { icon: faMoneyBillWave, color: "text-success" },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleApplyFilters = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilterTerm("All");
    setTempStartDate("");
    setTempEndDate("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    setOpenFilter(false);
  };

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
  if (!hasAccess) {
    return <PasswordPrompt onSuccess={handleSuccess} />;
  }

  return (
    <div className="container" style={{ maxWidth: "1400px" }}>
      {/* <h2 className="mb-4 text-center fw-bold" style={{ color: 'var(--mainColor, #007bff)' }}>
        Transactions
      </h2> */}
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
      {isError && (
        <Errors message={error.message || "Failed to load transactions"} />
      )}
      {isLoading && <Loader />}

      {/* Filter UI */}
      <div className="mb-4">
        <div className="d-flex flex-wrap align-items-center gap-3 col-lg-7 col-12 mb-3">
          <select
            className="border-1 rounded-2 px-2 py-1"
            name="transactionType"
            id="transactionType"
            value={filterTerm}
            onChange={(e) => {
              setFilterTerm(e.target.value);
              setPage(1);
            }}
          >
            <option value="All" className="shadow-lg">
              All
            </option>
            <option value="Order Picked" className="shadow-lg">
              Order Picked
            </option>
            <option value="Balance Recharged" className="shadow-lg">
              Balance Recharged
            </option>
          </select>
        </div>

        {!openFilter && (
          <button
            className="btn btn-outline-secondary mb-2"
            onClick={() => setOpenFilter(!openFilter)}
          >
            Filter By Date
          </button>
        )}
        {openFilter && (
          <div>
            <div className="d-flex flex-wrap align-items-start gap-3">
              <div className="d-flex align-items-center gap-2">
                <label htmlFor="startDate" className="form-label">
                  From:
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  className="form-control w-100"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  style={{ display: "inline-block", width: "auto" }}
                />
              </div>
              <div className="d-flex align-items-center gap-2 justify-content-between">
                <label htmlFor="endDate" className="form-label">
                  To:
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  className="form-control w-100"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  style={{ display: "inline-block", width: "auto" }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleApplyFilters}>
                Apply Filters
              </button>
            </div>
            <button
              className="btn btn-outline-secondary mt-3"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table (Visible on md and larger screens) */}
      <div className="d-none d-md-block card shadow-sm mb-4">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Type
                </th>
                <th scope="col" className="px-4 py-3">
                  Amount
                </th>
                <th scope="col" className="px-4 py-3">
                  Details
                </th>
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length > 0 ? (
                data?.data?.map((transaction, index) => (
                  <tr key={index} className="align-middle">
                    <td className="px-4 py-3">
                      <FontAwesomeIcon
                        icon={
                          transactionStyles[transaction?.transaction_type]
                            ?.icon || faMoneyBillWave
                        }
                        className={
                          transactionStyles[transaction?.transaction_type]
                            ?.color || "text-secondary"
                        }
                        size="lg"
                      />
                      <span className="ms-2 text-capitalize">
                        {transaction.transaction_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{transaction.amount} EGP</td>
                    <td className="px-4 py-3">
                      {transaction.details || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(transaction.date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    {isLoading ? <Loader /> : "No transactions found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions Cards (Visible on sm and smaller screens) */}
      <div className="d-md-none row g-3">
        {data?.data?.length > 0 ? (
          data?.data?.map((transaction, index) => (
            <div key={index} className="col-12">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon
                      icon={
                        transactionStyles[transaction.transaction_type]?.icon ||
                        faMoneyBillWave
                      }
                      className={
                        transactionStyles[transaction.transaction_type]
                          ?.color || "text-secondary"
                      }
                      size="lg"
                    />
                    <h6 className="mb-0 text-capitalize">
                      {transaction.transaction_type.replace("_", " ")}
                    </h6>
                  </div>
                  <div className="text-muted small">
                    <strong>Amount:</strong> {transaction.amount} LE
                  </div>
                  <div className="text-muted small">
                    <strong>Details:</strong> {transaction.details || "N/A"}
                  </div>
                  <div className="text-muted small">
                    <strong>Date:</strong> {formatDate(transaction.date)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center text-muted py-4">
              {isLoading ? <Loader /> : "No transactions found"}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.data?.length > 0 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            style={{
              width: "100px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid var(--mainColor, #007bff)",
              color: "var(--mainColor, #007bff)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Previous
          </button>
          <span
            className="fw-bold"
            style={{ color: "var(--mainColor, #007bff)" }}
          >
            Page {page}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data?.next}
            style={{
              width: "100px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid var(--mainColor, #007bff)",
              color: "var(--mainColor, #007bff)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
