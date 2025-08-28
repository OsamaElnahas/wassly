import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsProgress,
  faCalculator,
  faCashRegister,
  faCheckCircle,
  faCircleChevronUp,
  faCircleDollarToSlot,
  faCircleQuestion,
  faDotCircle,
  faKeyboard,
  faMoneyBillTransfer,
  faMoneyBillWave,
  faMoneyCheck,
  faMoneyCheckDollar,
  faMotorcycle,
  faUserCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../Loader/Loader";
import Errors from "../Error/Errors";
import PasswordPrompt from "../../PasswordPrompet/PasswordPrompet";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";
import AddNewType from "./AddNewType";
import AddTransactions from "./AddTransactions";
import { ToastContainer } from "react-toastify";
import { FaCheckDouble, FaMoneyCheck } from "react-icons/fa";

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
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddTypeTransaction, setShowAddTypeTransaction] = useState(false);
  const baseUrl = useSelector(selectBaseUrl);

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
        filterTerm === "All" || filterTerm === "add new" ? "" : filterTerm;

      const params = {
        page,
        page_size: pageSize,
      };
      if (type) params.transaction_type = type;
      if (startDate) params.from = startDate;
      if (endDate) params.to = endDate;

      const res = await axios.get(`${baseUrl}api/transactions/`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
        params,
      });
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

  async function fetchTransactionTypes() {
    try {
      const res = await axios.get(`${baseUrl}api/transaction-types/`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
        params: {
          page: 1,
          page_size: 15,
        },
      });
      console.log("Transaction Types:", res?.data);
      return res?.data || [];
    } catch (error) {
      console.error("Error fetching transaction types:", error);
      throw error;
    }
  }

  const { data: transactionTypesList, isLoading: isLoadingTransactionTypes } =
    useQuery({
      queryKey: ["transactionTypesList"],
      queryFn: fetchTransactionTypes,
    });

  const transactionStyles = {
    "Order Picked": { icon: faMotorcycle, color: "text-primary" },
    "Balance Recharged": { icon: faMoneyCheckDollar, color: "text-success" },
  };
  const defaultStyle = { icon: faDotCircle, color: "text-secondary" };

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
          className="btn  text-capitalize bg-white text-primary border-primary outline-primary d-flex justify-content-center align-items-center gap-2"
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
      <div className="">
        <div className="d-flex flex-wrap align-items-center gap-3 col-xl-4 col-lg-5 col-md-8 col-12 my-2">
          <select
            className="border-1 rounded-2 px-2 py-1"
            name="transactionType"
            id="transactionType"
            value={filterTerm}
            onChange={(e) => {
              if (e.target.value === "add new") {
                setShowAddTypeTransaction(true);
                e.target.value = "All";
              } else {
                setFilterTerm(e.target.value);
                setPage(1);
              }
            }}
            style={{
              minHeight: "30px",
              overflowY: "scroll",
              width: "100%",
            }}
          >
            <option value="All" className="shadow-lg">
              All
            </option>
            {isLoadingTransactionTypes ? (
              <option value="" disabled className="shadow-lg">
                Loading...
              </option>
            ) : (
              transactionTypesList?.data?.data?.map((type) => (
                <option key={type.id} value={type.id} className="shadow-lg">
                  {type.name}
                </option>
              ))
            )}
            <option value="add new" className="shadow-lg">
              + Add New Type
            </option>
          </select>
        </div>
        {showAddTypeTransaction && (
          <AddNewType onClose={() => setShowAddTypeTransaction(false)} />
        )}

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
      <div className="d-flex justify-content-between align-items-center my-3">
        <div
          className="my-2"
          style={{ fontWeight: "800", color: "var(--mainColor)" }}
        >
          Transactions ({data?.count || 0})
        </div>
        <button
          className=" btn  text-capitalize btn-primary d-flex align-items-center gap-2"
          onClick={() => setShowAddTransaction(true)}
        >
          + new Record{" "}
        </button>
      </div>
      {showAddTransaction && (
        <AddTransactions onClose={() => setShowAddTransaction(false)} />
      )}
      <div
        className="row align-items-center gx-0 w-100"
        style={{ maxWidth: "1400px" }}
      >
        <ToastContainer />
        {/* Transactions Table (Visible on md and larger screens) */}
        <div className="d-none d-md-block card shadow-sm mb-4 border-0 w-100 rounded-3">
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
                            transactionStyles[
                              transaction?.transaction_type?.name
                            ]?.icon || defaultStyle.icon
                          }
                          className={
                            transactionStyles[
                              transaction?.transaction_type?.name
                            ]?.color || defaultStyle.color
                          }
                          size="lg"
                        />
                        <span className="ms-2 text-capitalize">
                          {transaction.transaction_type?.name.replace("_", " ")}
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
                        transactionStyles[transaction.transaction_type?.name]
                          ?.icon || faMoneyBillWave
                      }
                      className={
                        transactionStyles[transaction.transaction_type?.name]
                          ?.color || "text-secondary"
                      }
                      size="lg"
                    />
                    <h6 className="mb-0 text-capitalize">
                      {transaction.transaction_type?.name.replace("_", " ")}
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
            disabled={!data?.data?.next}
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
