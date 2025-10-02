import { useState } from "react";
import { Card, Collapse, Button, Row, Col } from "react-bootstrap";
import {
  faChevronDown,
  faChevronUp,
  faCalendarAlt,
  faMoneyBillWave,
  faTruck,
  faMinusCircle,
  faCheckCircle,
  faTimesCircle,
  faMoneyBillTrendUp,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DailyIncomes() {
  const [openIndex, setOpenIndex] = useState(null);
  const dailyData = [
    {
      id: 1,
      date: "2025-09-18",
      amount: 1200,
      handed_over: true,
      reviewed: false,
      details: {
        shipping: [
          { driver: "Abdo Mostafa", amount: 700 },
          { driver: "Ahmed Ayman", amount: 800 },
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
      amount: 900,
      handed_over: true,
      reviewed: true,
      details: {
        shipping: [{ driver: "Mohamed", amount: 1200 }],
        deductions: [{ type: "Rental", amount: 300 }],
      },
    },
  ];

  return (
    <div
      className="container "
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <h3
        className="mb-4 fw-semibold"
        style={{ letterSpacing: "0.05em", color: "#222" }}
      >
        Daily Incomes
      </h3>
      {dailyData.map((day, idx) => {
        const isOpen = openIndex === idx;
        return (
          <Card
            key={day.id}
            className="mb-3  "
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
                    style={{ fontWeight: 600, fontSize: "1rem", color: "#333" }}
                  >
                    {day.date}
                  </span>
                </Col>

                <Col
                  xs={12}
                  md={4}
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
                  xs={10}
                  md={3}
                  className="d-flex align-items-center gap-3 justify-content-md-end flex-wrap"
                  style={{ fontSize: "0.9rem" }}
                >
                  <div className="d-flex align-items-center gap-1">
                    Handed Over:{" "}
                    <FontAwesomeIcon
                      icon={day.handed_over ? faCheckCircle : faTimesCircle}
                      className={
                        day.handed_over ? "text-success" : "text-danger"
                      }
                    />
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    Reviewed:{" "}
                    <FontAwesomeIcon
                      icon={day.reviewed ? faCheckCircle : faTimesCircle}
                      className={day.reviewed ? "text-success" : "text-danger"}
                    />
                  </div>
                </Col>

                <Col xs={2} md={1} className="d-flex justify-content-end">
                  <Button
                    variant="light"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIndex(isOpen ? null : idx);
                    }}
                    aria-label={isOpen ? "Collapse details" : "Expand details"}
                    style={{
                      borderRadius: "50%",
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} size="lg" />
                  </Button>
                </Col>
              </Row>

              {/* Expanded content */}
              <Collapse in={isOpen}>
                <div id={`collapse-${day.id}`} className="mt-4 pt-3 border-top">
                  <Row>
                    {/* Shipping Income */}
                    <Col xs={12} md={6} className="mb-4 mb-md-0">
                      <h6 className="d-flex align-items-center gap-2 mb-3 text-primary">
                        <FontAwesomeIcon icon={faHandHoldingDollar} />
                        Cash Collector
                      </h6>
                      <ul
                        className="list-unstyled"
                        style={{ fontSize: "0.95rem", color: "#444" }}
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
                        style={{ fontSize: "0.95rem", color: "#444" }}
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
  );
}
