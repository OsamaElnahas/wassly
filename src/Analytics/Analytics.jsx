import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faStore,
  faUsers,
  faTruck,
  faCalendarAlt,
  faFilter,
  faSearch,
  faCoins,
  faUserTie,
  faGift,
  faChartLine,
  faMoneyBillWave,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loader from "../components/Loader/Loader";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../features/api/apiSlice";

// Register Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// === API Fetch Function ===

export default function Analytics() {
  const [openFilter, setOpenFilter] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const baseUrl = useSelector(selectBaseUrl);

  // ===== API Hook with React Query =====
  async function fetchAnalytics(api) {
    const params = {};
    if (startDate) params.from = startDate;
    if (endDate) params.to = endDate;

    try {
      // console.log(
      //   "Full URL:",
      //   `${baseUrl}${api}`,
      //   "Token:",
      //   localStorage.getItem("token")
      // );
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
    data: wassallyData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["wassallyAnalytics", startDate, endDate, baseUrl],
    queryFn: () => fetchAnalytics("api/transactions/"),
    keepPreviousData: true,
    refetchOnWindowFocus: true,
  });

  // ===== Dummy Totals (replace with API data if available) =====
  const crewsTotal = 12450;
  const shopsTotal = 8300;
  const wassallyTotal = 15600;
  const expensesTotal = 7400;
  const salariesTotal = 9600;
  const incentivesTotal = 4200;
  const totalGainWassally =
    crewsTotal +
    shopsTotal +
    wassallyTotal -
    expensesTotal -
    salariesTotal -
    incentivesTotal;

  const handleApplyFilters = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setOpenFilter(false);
  };

  const handleClearFilters = () => {
    setTempStartDate("");
    setTempEndDate("");
    setStartDate("");
    setEndDate("");
    setOpenFilter(false);
  };

  // ===== Chart Data =====
  const chartData = {
    labels: [
      "Crews",
      "Shops",
      "Expenses",
      "Salaries",
      "Incentives",
      "Wassally",
    ],
    datasets: [
      {
        label: "Financial Data (EGP)",
        data: [
          crewsTotal,
          shopsTotal,
          expensesTotal,
          salariesTotal,
          incentivesTotal,
          wassallyTotal,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Financial Overview" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div
      className="container-fluid p-0"
      style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container-fluid px-3 py-3">
          {/* Filter Section */}
          <div className="card mb-4 rounded-4 shadow-md">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 fw-semibold" style={{ color: "#4a5568" }}>
                  <FontAwesomeIcon
                    icon={faFilter}
                    className="me-2 text-primary"
                  />
                  Date Filters
                </h5>
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setOpenFilter(!openFilter)}
                  style={{ color: "#718096" }}
                >
                  {openFilter ? "Hide" : "Show"} Filters
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={`ms-1 ${openFilter ? "rotate-180" : ""}`}
                    style={{ transition: "transform 0.3s ease" }}
                  />
                </button>
              </div>

              {/* Wrapper for smooth height/opacity transition */}
              <div
                className="filter-content"
                style={{
                  maxHeight: openFilter ? "200px" : "0",
                  overflow: "hidden",
                  opacity: openFilter ? 1 : 0,
                  transition: "max-height 0.3s ease, opacity 0.3s ease",
                }}
              >
                {openFilter && (
                  <form className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label
                        htmlFor="startDate"
                        className="form-label fw-medium"
                      >
                        From
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </span>
                        <input
                          type="datetime-local"
                          id="startDate"
                          className="form-control"
                          value={tempStartDate}
                          onChange={(e) => setTempStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="endDate" className="form-label fw-medium">
                        To
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </span>
                        <input
                          type="datetime-local"
                          id="endDate"
                          className="form-control"
                          value={tempEndDate}
                          onChange={(e) => setTempEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={handleApplyFilters}
                      >
                        <FontAwesomeIcon icon={faSearch} className="me-1" />
                        Apply
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleClearFilters}
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {startDate || endDate ? (
                <div className="mt-2 text-muted small">
                  Applied: {startDate} to {endDate}
                </div>
              ) : null}
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="row g-4 mb-5">
            <StatCard
              title="Profits - Crews"
              subtitle="Total this month"
              value={crewsTotal}
              icon={faUsers}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <StatCard
              title="Profits - Shops"
              subtitle="Performance this month"
              value={shopsTotal}
              icon={faStore}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
            <StatCard
              title="Profits - Wassally"
              subtitle="Delivery network"
              value={wassallyTotal}
              icon={faHandHoldingDollar}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
            <StatCard
              title="Expenses"
              subtitle="This month"
              value={expensesTotal}
              icon={faCoins}
              gradient="linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)"
            />
            <StatCard
              title="Salaries"
              subtitle="Monthly Payroll"
              value={salariesTotal}
              icon={faUserTie}
              gradient="linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)"
            />
            <StatCard
              title="Incentives"
              subtitle="Employee bonuses"
              value={incentivesTotal}
              icon={faGift}
              gradient="linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)"
            />
            <StatCard
              title="Total Gain Wassally"
              subtitle="Net monthly result"
              value={totalGainWassally}
              icon={faChartLine}
              gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
            />
          </div>

          {/* Chart */}
          <div className="card rounded-4 shadow-md overflow-hidden">
            <div className="card-body p-4">
              <h5
                className="card-title fw-semibold mb-4"
                style={{ color: "#4a5568" }}
              >
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="me-2 text-primary"
                />
                Performance Overview
              </h5>
              <div style={{ height: "400px" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== Reusable Stat Card Component ====== */
function StatCard({ title, subtitle, value, icon, gradient }) {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
      <div
        className="card h-100 rounded-4 shadow-md overflow-hidden position-relative"
        style={{
          background: gradient,
          color: "white",
          border: "none",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="p-3 rounded-circle bg-white bg-opacity-20 me-3"
              style={{
                backdropFilter: "blur(10px)",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                color: gradient.split(",")[1].trim().split(" ")[0],
              }}
            >
              <FontAwesomeIcon icon={icon} size="lg" />
            </div>
            <div>
              <h6 className="mb-1 fw-semibold">{title}</h6>
              <p className="mb-0 opacity-75 small">{subtitle}</p>
            </div>
          </div>
          <div className="h4 fw-bold mb-0">{value.toLocaleString()} EGP</div>
        </div>
      </div>
    </div>
  );
}
