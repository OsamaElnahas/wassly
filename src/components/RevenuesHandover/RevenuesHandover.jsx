import {
  faArrowLeftRotate,
  faBalanceScale,
  faCalendarDays,
  faChartDiagram,
  faChartGantt,
  faCoins,
  faDashboard,
  faHandshake,
  faMoneyBillTrendUp,
  faMoneyCheck,
  faParagraph,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { FaChartPie, FaDailymotion } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";

export default function RevenuesHandover() {
  return (
    <>
      <div
        className="row rounded-4  mb-4"
        style={{
          marginBottom: "1rem",
          backgroundColor: "white",
          color: "var(--sidebarBg)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          fontSize: "0.9rem",
        }}
      >
        <div className="row align-items-center bg-white rounded-pill m-0 px-3">
          {/* Tabs */}
          <div className="col-12 col-lg-8 d-flex align-items-center gap-3 p-0">
            <NavLink
              to="handOver"
              end
              className="item p-2 mb-lg-0 fw-bold pointer col-4 d-flex justify-content-center"
              style={({ isActive }) => ({
                borderBottom: isActive ? "4px solid var(--mainColor)" : "",
                color: isActive ? "var(--mainColor)" : "var(--sidebarBg)",
                transition: "border 0.2s ease",
              })}
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    backgroundColor: "var(--secondaryColor)",
                    color: "var(--mainColor)",
                    width: "35px",
                    height: "35px",
                    padding: "5px 6px",
                  }}
                >
                  <FontAwesomeIcon icon={faHandshake} className="w-100 h-100" />
                </span>

                <span>Handover</span>
              </div>
            </NavLink>

            <NavLink
              to="revenue"
              className="item p-2 mb-lg-0  fw-bold pointer col-4 d-flex justify-content-center"
              style={({ isActive }) => ({
                borderBottom: isActive ? "4px solid var(--mainColor)" : "",
                color: isActive ? "var(--mainColor)" : "var(--sidebarBg)",
                transition: "border 0.2s ease",
              })}
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-flex align-items-center justify-content-center  rounded-circle "
                  style={{
                    backgroundColor: "var(--secondaryColor)",
                    color: "var(--mainColor)",
                    width: "35px",
                    height: "35px",
                    padding: "5px 6px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMoneyBillTrendUp}
                    className="w-100 h-100"
                  />
                </span>

                <span>Revenue</span>
              </div>
            </NavLink>
          </div>

          {/* Search + History + Add Order */}
        </div>
      </div>
      <div className="row  mt-4 ">
        <Outlet />
      </div>
    </>
  );
}
