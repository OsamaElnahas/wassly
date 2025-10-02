import React, { useState } from "react";
import CardIdentifier from "../CardIdentifier/CardIdentifier";
import { data, Link, useParams } from "react-router-dom";
import axios from "axios";
import Errors from "../Error/Errors";
import Loader from "../Loader/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import img from "../../images/user2.png";
import img2 from "../../images/user.png";
import {
  faMoneyBillWave,
  faDollarSign,
  faMotorcycle,
  faMoneyCheckDollar,
  faDotCircle,
  faMoneyBillTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RechargeCoin from "./ChargeCoins";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";
import toast from "react-hot-toast";

export default function TayarDetails() {
  const { id } = useParams();
  const [filterTerm, setFilterTerm] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tempStartDate, setTempStartDate] = useState(""); // Temporary state for start date
  const [tempEndDate, setTempEndDate] = useState("");
  const [chargePopUp, setChargePopUp] = useState(false);
  const [page, setPage] = useState(1);

  const [openfilter, setOpenFilter] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [verifyStatus, setVerifyStatus] = useState("null");

  const pageSize = 8;
  const baseUrl = useSelector(selectBaseUrl);

  const queryClient = useQueryClient();
  const fetchTransactions = async () => {
    try {
      const type =
        filterTerm === "All" ? "" : filterTerm.toLowerCase().replace(" ", "_");
      const params = {
        page,
        page_size: pageSize,
        user: id,
      };
      if (type) params.transaction_type = type;
      if (startDate) params.from = startDate;
      if (endDate) params.to = endDate;

      const res = await axios.get(`${baseUrl}api/transactions/`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
        params,
      });
      console.log("Fetched transactions:", res?.data);
      return res?.data || { data: [] };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  const {
    data: transactionData,
    isLoading: transactionIsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactions", id, filterTerm, page, startDate, endDate],
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

  async function VerifyDriver() {
    try {
      const res = await axios.post(
        `${baseUrl}api/crew/verify/${id}/`,
        {},
        {
          headers: { Authorization: "Token " + localStorage.getItem("token") },
        }
      );
      console.log("Verify Driver Response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error verifying driver:", error);
      throw error;
    }
  }
  const mutation = useMutation({
    mutationFn: VerifyDriver,

    onSuccess: (data) => {
      console.log("✅ Driver verified:", data);
      setVerifyStatus("success");
      queryClient.invalidateQueries({
        queryKey: ["tayarDetails", id],
      });

      toast.success("Driver verified successfully");
    },
    onError: (error) => {
      setVerifyStatus("error");
      console.error("❌ Verification failed:", error);
      toast.error("Driver verification failed");
    },
  });

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

  async function getTayarDetails() {
    try {
      const res = await axios.get(`${baseUrl}api/crews/${id}/`, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      console.log("Tayar Details:", res.data.data);
      return res?.data.data;
    } catch (error) {
      console.error("Error fetching Tayar details:", error);
      throw error;
    }
  }

  const {
    data: tayarData,
    isLoading: tayarIsLoading,
    isError: tayarIsError,
    error: tayarError,
  } = useQuery({
    queryKey: ["tayarDetails", id],
    queryFn: getTayarDetails,
  });
  // async function getTayarProfs() {
  //   try {
  //     const res = await axios.get(`${baseUrl}api/crew/profits/`, {
  //       params: {
  //         crew_id: id,
  //         month: month,
  //       },
  //       headers: {
  //         Authorization: "Token " + localStorage.getItem("token"),
  //       },
  //     });
  //     console.log("Tayar profs:", res.data?.data);
  //     return res?.data.data;
  //   } catch (error) {
  //     console.error("Error fetching Tayar profits:", error);
  //     throw error;
  //   }
  // }

  // const {
  //   data: tayarProfData,
  //   isLoading: tayarProfIsLoading,
  //   isError: tayarProfIsError,
  //   error: tayarProfError,
  // } = useQuery({
  //   queryKey: ["tayarProf", month, tayarData?.active_orders],
  //   queryFn: getTayarProfs,
  // });
  if (tayarIsLoading) return <Loader />;
  if (tayarIsError)
    return (
      <Errors message={tayarError.message || "Failed to load Tayar details"} />
    );

  const transactionStyles = {
    "Order Picked": { icon: faMotorcycle, color: "text-primary" },
    "Balance Recharged": { icon: faMoneyCheckDollar, color: "text-success" },
  };
  const defaultStyle = { icon: faDotCircle, color: "text-secondary" };
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-end  mb-4">
        <button
          className="btn  rounded-3 shadow-sm mb-2 ml-auto"
          disabled={!tayarData?.verified}
          onClick={() => {
            setChargePopUp(true);
          }}
          style={{
            backgroundColor: "var(--mainColor)",
            color: "white",
            border: "none",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            cursor: "pointer",
            fontSize: "16px",
            width: "10rem",
            padding: "4px",
          }}
        >
          <FontAwesomeIcon icon={faMoneyBillTrendUp} className="me-2" />
          Charge
        </button>
      </div>

      <section>
        <CardIdentifier
          image={tayarData?.profile_picture || img2}
          title={tayarData?.username || "Tayar Name"}
          phone={tayarData?.phone_number}
          type={tayarData?.crew_type}
          TayarIsActive={tayarData?.is_active}
          nationalIdFront={tayarData?.national_id?.front_image_url || null}
          nationalIdBack={tayarData?.national_id?.back_image_url || null}
          balance={tayarData?.balance || 0}
          numberOfActiveOrders={tayarData?.active_orders}
          email={tayarData?.email}
          number_of_deliveries={tayarData?.number_of_deliveries}
          date_joined={formatDate(tayarData?.date_joined)}
          verified={tayarData?.verified}
          verifyStatus={
            mutation.isPending
              ? "loading"
              : mutation.isSuccess
              ? "success"
              : mutation.isError
              ? "error"
              : "null"
          }
          verifyFn={() => mutation.mutate()}
        />
      </section>
      {/* <section>
      <div className='container 'style={{ maxWidth: '1400px' }}>

      <div className="bg-white px-3 py-4 rounded shadow-sm mt-4 mb-4 mb-md-0 ">
  <div className="header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
    <div
      className="title fw-bold fs-5"
      style={{
        color: 'var(--mainColor)',
      }}
    >
      Monthly Income
    </div>
    <div style={{ width: '14rem' }}>
      <select
        onChange={(e) => setMonth(e.target.value)}
        name="month"
        value={month}
        disabled={tayarProfIsLoading}
        className="px-2 py-1 rounded  w-100"
        style={{
          color: 'var(--mainColor)',
          border: '1px solid var(--thirdColor)',
          outline: 'none',
        }}
      >
        <option value="">Select The Month</option>
        <option value="1">يناير</option>
        <option value="2">فبراير</option>
        <option value="3">مارس</option>
        <option value="4">ابريل</option>
        <option value="5">مايو</option>
        <option value="6">يونيو</option>
        <option value="7">يوليو</option>
        <option value="8">اغسطس</option>
        <option value="9">سبتمبر</option>
        <option value="10">اكتوبر</option>
        <option value="11">نوفمبر</option>
        <option value="12">ديسمبر</option>
      </select>
    </div>
  </div>
  {tayarProfIsLoading ? (
    <Loader size='10vh' />
  ) : (
   
  

  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
    <div className="item d-flex flex-column align-items-center gap-3 w-100">
      <span
        className="fw-bold"
        style={{
          color: 'var(--mainColor)',
        }}
      >
        Total Orders
      </span>
      <span
        className="fw-bold px-3 py-2 rounded text-white text-center fs-5"
        style={{
          backgroundColor: 'var(--thirdColor)',
          width: '100%',
          maxWidth: '17rem',
        }}
      >
        {tayarProfData?.summary?.total_orders}
      </span>
    </div>
    <div className="item d-flex flex-column align-items-center gap-3 w-100">
      <span
        className="fw-bold"
        style={{
          color: 'var(--mainColor)',
        }}
      >
        Driver Income
      </span>
      <span
        className="fw-bold px-3 py-2 rounded text-white text-center fs-5"
        style={{
          backgroundColor: 'var(--thirdColor)',
          width: '100%',
          maxWidth: '17rem',
        }}
      >
        {tayarProfData?.summary?.crew_earnings} LE
      </span>
    </div>

    <div className="item d-flex flex-column align-items-center gap-3 w-100">
      <span
        className="fw-bold"
        style={{
          color: 'var(--mainColor)',
        }}
      >
        Wassaly Income
      </span>
      <span
        className="fw-bold px-3 py-2 rounded text-white text-center fs-5"
        style={{
          backgroundColor: 'var(--thirdColor)',
          width: '100%',
          maxWidth: '17rem',
        }}
      >
        {tayarProfData?.summary?.wassally_cut} LE
      </span>
    </div>
  </div>
  )}
</div>
        </div>
        </section> */}

      <section>
        <div className="container mt-5" style={{ maxWidth: "1400px" }}>
          <div
            className="text-center fw-bold"
            style={{
              color: "var(--mainColor, #007bff)",
              fontSize: "1.2rem",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
              marginBottom: "30px",
            }}
          >
            Transactions for {tayarData?.username || "Tayar"}
          </div>
          {chargePopUp && (
            <RechargeCoin
              id={id}
              username={tayarData?.username}
              onClose={() => {
                setChargePopUp(false);
              }}
            />
          )}

          {isError && (
            <Errors message={error.message || "Failed to load transactions"} />
          )}
          {transactionIsLoading && <Loader />}

          {/* Filter UI */}
          <div className="mb-2 d-flex flex-column flex-md-row justify-content-md-between align-items-md-start gap-3">
            <div>
              <select
                className="border-1 rounded-2 px-2 py-1"
                name="transactionType"
                id="transactionType"
                value={filterTerm}
                onChange={(e) => {
                  if (e.target.value === "add new") {
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

            {/* Right Side: Date Filters */}
            <div>
              {!openfilter && (
                <button
                  className="btn btn-outline-secondary mb-2"
                  onClick={() => setOpenFilter(!openfilter)}
                >
                  Filter By Date
                </button>
              )}
              {openfilter && (
                <div>
                  <div className="d-flex flex-wrap align-items-start gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="startDate" className="form-label">
                        From:
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        className="form-control"
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                        style={{ width: "auto" }}
                      />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="endDate" className="form-label">
                        To:
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        className="form-control"
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                        style={{ width: "auto" }}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleApplyFilters}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {(openfilter || filterTerm !== "All") && (
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
          <div
            className="my-2"
            style={{ fontWeight: "800", color: "var(--mainColor)" }}
          >
            Transactions ({transactionData?.count || 0})
          </div>
          {/* Transactions Table (Large Screens) */}
          <div className="d-none d-md-block card shadow-sm mb-4 border-0">
            <div className="card-body p-0">
              <table className="table table-hover mb-0 rounded-3 overflow-hidden">
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
                  {transactionData?.data?.length > 0 ? (
                    transactionData?.data?.map((transaction, index) => (
                      <tr key={index} className="align-middle">
                        <td className="px-4 py-3">
                          <FontAwesomeIcon
                            icon={
                              transactionStyles[
                                transaction?.transaction_type?.name
                              ]?.icon || faDotCircle
                            }
                            className={
                              transactionStyles[
                                transaction?.transaction_type?.name
                              ]?.color || "text-secondary"
                            }
                            size="lg"
                          />
                          {transaction?.transaction_type?.name.replace(
                            "_",
                            " "
                          ) === "order picked" ? (
                            <Link
                              to={`/tayareen/tayaarDetails/${transaction?.order_id}`}
                              className="ms-2 text-capitalize"
                            >
                              {transaction.transaction_type?.name.replace(
                                "_",
                                " "
                              )}
                            </Link>
                          ) : (
                            <span className="ms-2 text-capitalize">
                              {transaction.transaction_type?.name.replace(
                                "_",
                                " "
                              )}
                            </span>
                          )}
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
                        {transactionIsLoading ? (
                          <Loader />
                        ) : (
                          "No transactions found"
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
                {transactionData?.data?.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <div className="d-flex justify-content-center align-items-center gap-3">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                              setPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={page === 1}
                            style={{
                              width: "100px",
                              padding: "5px",
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
                            disabled={!transactionData?.next}
                            style={{
                              width: "100px",
                              padding: "4px",
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
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Transactions (Smaller Screens) */}
          <div className="d-md-none row g-3">
            {transactionData?.data?.length > 0 ? (
              transactionData.data.map((transaction, index) => (
                <div key={index} className="col-12">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon
                          icon={
                            transactionStyles[
                              transaction?.transaction_type?.name
                            ]?.icon || faMoneyBillWave
                          }
                          className={
                            transactionStyles[
                              transaction?.transaction_type?.name
                            ]?.color || "text-secondary"
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
                  {transactionIsLoading ? <Loader /> : "No transactions found"}
                </div>
              </div>
            )}

            {/* Pagination for Smaller Screens */}
            {transactionData?.data?.length > 0 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  style={{
                    width: "100px",
                    padding: "4px",
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
                  disabled={!transactionData?.next}
                  style={{
                    width: "100px",
                    padding: "4px",
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
        </div>
      </section>
    </>
  );
}
