import React, { useState, useEffect } from "react";
import PasswordPrompt from "../PasswordPrompet/PasswordPrompet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faStore,
  faUsers,
  faTruck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { selectBaseUrl } from "../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader/Loader";

export default function Analytics() {
  const [hasAccess, setHasAccess] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const baseUrl = useSelector(selectBaseUrl);

  console.log(
    "Analytics component mounted",
    "baseUrl:",
    baseUrl,
    "token:",
    localStorage.getItem("token")
  );

  const handleSuccess = () => {
    sessionStorage.setItem("analyticsAccess", "true");
    setHasAccess(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("analyticsAccess");
    setHasAccess(false);
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
  };

  const handleClearFilters = () => {
    setTempStartDate("");
    setTempEndDate("");
    setStartDate("");
    setEndDate("");
    setOpenFilter(false);
  };

  useEffect(() => {
    const sessionAccess = sessionStorage.getItem("analyticsAccess");
    if (sessionAccess === "true") {
      setHasAccess(true);
    }
  }, []);

  async function fetchAnalytics(api) {
    const params = {};
    if (startDate) {
      params.from = startDate;
    }
    if (endDate) {
      params.to = endDate;
    }
    try {
      console.log(
        "Full URL:",
        `${baseUrl}${api}`,
        "Token:",
        localStorage.getItem("token")
      );
      const res = await axios.get(`${baseUrl}${api}`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
        params: params,
      });
      console.log("API response:", res.data);
      return res?.data || { data: [] };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }

  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetchAnalytics("api/transactions/"),
    // enabled: hasAccess, // Uncomment to test with hasAccess control
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
  let total =
    analyticsData?.data.reduce((sum, item) => sum + Number(item.amount), 0) ||
    0;

  console.log("useQuery state:", { isLoading, isError, error, analyticsData });

  // if (!hasAccess) {
  //   return <PasswordPrompt onSuccess={handleSuccess} />;
  // }

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: "var(--backgroundColor)", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center py-3">
        <h3 style={{ color: "var(--mainColor)", fontWeight: "bold" }}>
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          Analytics Dashboard
        </h3>
        <button
          className="btn btn-danger d-flex align-items-center gap-2"
          style={{ transition: "var(--transition)" }}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faX} />
          Close
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Filter */}
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
                <button
                  className="btn btn-primary"
                  onClick={handleApplyFilters}
                >
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

          {/* Stats Cards */}
          <section className="row g-4 mt-2">
            <div className="col-lg-4 col-sm-6 col-12">
              <div
                className="card p-4 rounded-3 shadow-sm d-flex flex-column align-items-start h-100"
                style={{
                  backgroundColor: "var(--cardBg)",
                  border: "1px solid var(--borderColor)",
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon
                    icon={faUsers}
                    size="lg"
                    style={{ color: "var(--thirdColor)" }}
                  />
                  <div className="ms-2" style={{ fontSize: "1.2rem" }}>
                    Profits - Crews
                  </div>
                </div>
                <p className="text-muted">Total crews profits this month</p>
                <div style={{ color: "var(--mainColor)", fontSize: "1.4rem" }}>
                  12,450 EGP
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 col-12">
              <div
                className="card p-4 rounded-3 shadow-sm d-flex flex-column align-items-start h-100"
                style={{
                  backgroundColor: "var(--cardBg)",
                  border: "1px solid var(--borderColor)",
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon
                    icon={faStore}
                    size="lg"
                    style={{ color: "var(--thirdColor)" }}
                  />
                  <div className="ms-2" style={{ fontSize: "1.2rem" }}>
                    Profits - Shops
                  </div>
                </div>
                <p className="text-muted">Shops performance this month</p>
                <div style={{ color: "var(--mainColor)", fontSize: "1.4rem" }}>
                  8,300 EGP
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 col-12">
              <div
                className="card p-4 rounded-3 shadow-sm d-flex flex-column align-items-start h-100"
                style={{
                  backgroundColor: "var(--cardBg)",
                  border: "1px solid var(--borderColor)",
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon
                    icon={faTruck}
                    size="lg"
                    style={{ color: "var(--thirdColor)" }}
                  />
                  <div className="ms-2" style={{ fontSize: "1.2rem" }}>
                    Profits - Wassally
                  </div>
                </div>
                <p className="text-muted">Delivery network profits</p>
                <div style={{ color: "var(--mainColor)", fontSize: "1.4rem" }}>
                  {total}
                  EGP
                </div>
              </div>
            </div>
          </section>

          {/* Chart Section Placeholder */}
          <section className="mt-5 bg-white p-4 rounded-3 shadow-sm">
            <h5 style={{ color: "var(--mainColor)" }}>Performance Overview</h5>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px", color: "var(--textGray)" }}
            >
              📊 Chart
            </div>
          </section>
        </>
      )}
    </div>
  );
}
