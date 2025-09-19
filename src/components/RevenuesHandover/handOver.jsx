import {
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faHandHoldingDollar,
  faMoneyBillTrendUp,
  faMotorcycle,
  faPhone,
  faPlusCircle,
  faTimeline,
  faTimesCircle,
  faUserCircle,
  faChevronDown,
  faChevronUp,
  faMinusCircle,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Card, Col, Row, Button, Collapse } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function HandOver() {
  const [openIndex, setOpenIndex] = useState(null);

  const dailyData = [
    {
      id: 1,
      date: "2025-09-18",
      amount: 1500,
      handed_over: true,
      reviewed: false,
      details: {
        shipping: [
          { driver: "Ahmed", amount: 700 },
          { driver: "Ali", amount: 800 },
        ],
        deductions: [
          { type: "Rental", amount: 200 },
          { type: "Other", amount: 100 },
        ],
      },
    },
    {
      id: 2,
      date: "2025-09-17",
      amount: 1200,
      handed_over: false,
      reviewed: true,
      details: {
        shipping: [{ driver: "Mohamed", amount: 1200 }],
        deductions: [{ type: "Rental", amount: 300 }],
      },
    },
  ];

  return (
    <>
      <div className="row">
        <NavLink
          to="/RevenuesHandover"
          className="text-decoration-none text-dark d-flex align-items-center px-3 py-2 rounded-3 mb-3 bg-white"
          style={{ width: "fit-content", marginLeft: "auto" }}
        >
          <FontAwesomeIcon icon={faHistory} className="me-2" />
          History
        </NavLink>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10 d-flex justify-content-center">
          <div
            to=""
            className="orderCard mb-3 bg-white rounded-3 d-block text-decoration-none text-dark w-100"
            style={{
              transition: "all 0.3s ease",
              fontSize: "0.9rem",
              transform: "scale(1)",
              boxShadow: "none",
            }}
          >
            {/* Header */}
            <div
              className="cardHeader rounded-3 px-2 py-3"
              style={{
                background: "linear-gradient(to left, #1c1c1c, #7d7d7d)",
              }}
            >
              <div
                className="py-1 px-2 rounded-4 bg-opacity-10    mb-2"
                style={{
                  backgroundColor: "#e9d5ff",
                  fontSize: "0.875rem",
                  color: "#8140b7",
                  fontWeight: "semibold",
                  width: "fit-content",
                }}
              >
                Receipt
              </div>
              <div className="items d-flex justify-content-center  ">
                <div
                  className="right py-1 rounded-3 px-md-3 fw-bold d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#8898aa",
                    color: "white",
                    fontSize: "1rem",
                    minWidth: "130px",
                  }}
                >
                  2700 EGP
                </div>
              </div>

              <div className="headerFooter d-flex align-items-center justify-content-between mt-1">
                <div className="d-flex align-items-center fw-bold gap-2">
                  <FontAwesomeIcon
                    icon={faClock}
                    className=" rounded-pill "
                    style={{
                      color: "var(--sidebarBg)",
                      backgroundColor: "var(--secondaryColor)",
                      fontSize: "1rem",
                    }}
                  />
                  <div
                    className=""
                    style={{ fontSize: "0.9rem", color: "var(--textLight)" }}
                  >
                    20-09-2025
                  </div>
                </div>
                <div className="py-1 rounded-3 px-4 fw-bold text-white">
                  #12345
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="cardBody px-4 py-3">
              {/* Cash Collector Info */}

              <section className="CashCollectorInfo mt-2 d-flex justify-content-between align-items-center">
                <div className="row col-12">
                  {dailyData.map((day, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                      <Card
                        key={day.id}
                        className="mb-2  "
                        style={{
                          borderRadius: "12px",
                          backgroundColor: "#fff",
                          shadow: "0px",
                          boxShadow: "0px",
                          border: "0px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.border = "0 2px solid #007bff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.border = "0 2px solid #e0e0e0")
                        }
                      >
                        <Card.Body>
                          {/* Header with Bootstrap grid */}
                          <Row
                            className="align-items-center g-2 g-md-0 "
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            aria-expanded={isOpen}
                            aria-controls={`collapse-${day.id}`}
                          >
                            <Col
                              xs={12}
                              md={4}
                              className="d-flex align-items-center gap-2 mb-2 mb-md-0"
                            >
                              <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="text-primary"
                              />
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  color: "#333",
                                }}
                              >
                                {day.date}
                              </span>
                            </Col>

                            <Col
                              xs={12}
                              md={6}
                              className="d-flex align-items-center gap-2 justify-content-md-center mb-2 mb-md-0"
                            >
                              <FontAwesomeIcon
                                icon={faMoneyBillTrendUp}
                                className="text-success"
                              />
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: "1.1rem",
                                  color: "#2a7a2a",
                                }}
                              >
                                {day.amount.toLocaleString()} EGP
                              </span>
                            </Col>

                            <Col
                              xs={2}
                              md={2}
                              className="d-flex justify-content-end"
                            >
                              <Button
                                variant="light"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenIndex(isOpen ? null : idx);
                                }}
                                aria-label={
                                  isOpen ? "Collapse details" : "Expand details"
                                }
                                style={{
                                  borderRadius: "50%",
                                  width: "38px",
                                  height: "38px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  transition: "transform 0.3s ease",
                                  transform: isOpen
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faChevronDown}
                                  size="lg"
                                />
                              </Button>
                            </Col>
                          </Row>

                          {/* Expanded content */}
                          <Collapse in={isOpen}>
                            <div
                              id={`collapse-${day.id}`}
                              className="mt-4 pt-3 border-top"
                            >
                              <Row>
                                {/* Shipping Income */}
                                <Col xs={12} md={6} className="mb-4 mb-md-0">
                                  <h6 className="d-flex align-items-center gap-2 mb-3 text-primary">
                                    <FontAwesomeIcon
                                      icon={faHandHoldingDollar}
                                    />
                                    Cash Collector
                                  </h6>
                                  <ul
                                    className="list-unstyled"
                                    style={{
                                      fontSize: "0.95rem",
                                      color: "#444",
                                    }}
                                  >
                                    {day.details.shipping.map((s, i) => (
                                      <li
                                        key={i}
                                        className="d-flex justify-content-between align-items-center py-1 border-bottom border-1 border-light"
                                      >
                                        <span>{s.driver}</span>
                                        <strong style={{ color: "#198754" }}>
                                          {s.amount.toLocaleString()} EGP
                                        </strong>
                                      </li>
                                    ))}
                                  </ul>
                                </Col>

                                {/* Deductions */}
                                <Col xs={12} md={6}>
                                  <h6 className="d-flex align-items-center gap-2 mb-3 text-danger">
                                    <FontAwesomeIcon icon={faMinusCircle} />
                                    Deductions
                                  </h6>
                                  <ul
                                    className="list-unstyled"
                                    style={{
                                      fontSize: "0.95rem",
                                      color: "#444",
                                    }}
                                  >
                                    {day.details.deductions.map((d, i) => (
                                      <li
                                        key={i}
                                        className="d-flex justify-content-between align-items-center py-1 border-bottom border-1 border-light"
                                      >
                                        <span>{d.type}</span>
                                        <strong style={{ color: "#dc3545" }}>
                                          {d.amount.toLocaleString()} EGP
                                        </strong>
                                      </li>
                                    ))}
                                  </ul>
                                </Col>
                              </Row>
                            </div>
                          </Collapse>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
