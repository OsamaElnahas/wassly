import {
  faCheckCircle,
  faClock,
  faMotorcycle,
  faPhone,
  faPlusCircle,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { selectBaseUrl } from "../../features/api/apiSlice";
import { supabase } from "../../supabaseClient";
import Loader from "../Loader/Loader";
import Errors from "../Error/Errors";
import { formatDate } from "./Orders";
import axios from "axios";
const statusDisplay = {
  PENDING: "قيد الانتظار",
  IN_PROGRESS: "قيد التنفيذ",
  DELIVERED: "تم التوصيل",
  CANCELED: "تم الالغاء",
};

export default function ActiveOrders({ searchTerm, setSearchTerm }) {
  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const debounceRef = useRef(null);
  const queryClient = useQueryClient();
  const audioRef = useRef(new Audio("/assets/new_order.wav"));
  const navigate = useNavigate();

  const baseUrl = useSelector(selectBaseUrl);
  useEffect(() => {
    audioRef.current.preload = "auto";
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "text-warning bg-warning bg-opacity-10 fw-bolder";
      case "IN_PROGRESS":
        return "text-light bg-primary bg-opacity-10 fw-bolder";
      case "DELIVERED":
        return "text-dark bg-success bg-opacity-10 fw-bolder";
      case "CANCELED":
        return "text-danger bg-danger bg-opacity-10 fw-bolder";
      default:
        return "text-muted bg-light";
    }
  };

  async function getOrders() {
    try {
      const params = {};
      if (statusFilter !== "All") {
        params.status = statusFilter;
      }
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }
      params.page = page;
      params.page_size = pageSize;

      const response = await axios.get(`${baseUrl}api/wassally/orders/`, {
        params: params,
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      const { data, count } = response.data;
      return { data, count };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error.response?.data || error.message;
    }
  }

  async function getOrderById(id) {
    try {
      const response = await axios.get(`${baseUrl}api/wassally/orders/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      console.log(`Fetched full order ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching single order:", error);
      throw error;
    }
  }
  //   useEffect(() => {
  //     if (debounceRef.current) clearTimeout(debounceRef.current);
  //     debounceRef.current = setTimeout(() => {
  //       setSearchTerm(inputValue.trim());
  //       setPage(1);
  //     }, 500);
  //     return () => clearTimeout(debounceRef.current);
  //   }, [inputValue]);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["orders", statusFilter, page, pageSize, searchTerm],
    queryFn: getOrders,
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });
  useEffect(() => {
    const subscription = supabase
      .channel("wassally_wassallyorder_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wassally_wassallyorder",
        },
        async (payload) => {
          console.log("UPDATE payload:", payload);
          const updatedOrderPartial = payload.new;

          const mergeOrderUpdate = (order) => {
            const queries = queryClient.getQueriesData(["orders"]);
            queries.forEach(([key, old]) => {
              if (!old) return;

              let newData = (old.data || []).map((o) =>
                o.id === order.id ? { ...o, ...order } : o
              );

              const [_prefix, statusFilter, _page, _pageSize, searchTerm] = key;

              const matchesStatus =
                statusFilter === "All" || order.status === statusFilter;
              const matchesSearch =
                !searchTerm ||
                order.receiver_name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                order.receiver_phone
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                order.code?.toLowerCase().includes(searchTerm.toLowerCase());

              if (!matchesStatus || !matchesSearch) {
                newData = newData.filter((o) => o.id !== order.id);
              }

              queryClient.setQueryData(key, {
                ...old,
                data: newData,
                count: newData.length, // ✅ أدق من -1
              });
            });
          };

          // Optimistic update
          mergeOrderUpdate(updatedOrderPartial);

          try {
            const updatedOrderFull = await getOrderById(updatedOrderPartial.id);
            mergeOrderUpdate(updatedOrderFull);
          } catch (err) {
            console.error("Failed to fetch full order for update:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient, getOrderById]);

  if (isError) {
    console.error("Orders fetch error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    if (error.code === "PGRST116") {
      return <Errors errorMessage="No orders found" />;
    } else if (error.code === "42501") {
      return (
        <Errors errorMessage="Unauthorized Access - Check API or Supabase config" />
      );
    } else if (error.message == "Network Error") {
      return <Errors errorMessage="No Internet Connection" />;
    }
    return <Errors errorMessage={`Error: ${error.message}`} />;
  }

  if (isLoading) return <Loader />;

  return (
    <>
      <div
        className="px-3 px-sm-2 d-flex flex-column  justify-content-center gap-1 w-100"
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        <style>
          {`
            @keyframes pulse {
              0% {
                border-color: var(--mainColor);
                box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
              }
              50% {
                border-color: var(--mainColor);
                box-shadow: 0 0 7px 5px rgba(0, 123, 255, 0.3);
              }
              100% {
                border-color: var(--mainColor);
                box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
              }
            }
            .new-order {
              border: 2px solid var(--mainColor);
              animation: pulse 2s ease-in-out infinite;
            }
          `}
        </style>

        <div className="row align-items-center justify-content-between mb-3 gx-0">
          <div
            className="fw-bold col-6 mb-1 mb-lg-0"
            style={{ color: "var(--mainColor)" }}
          >
            Orders ({data?.count || 0})
          </div>
          <div className=" col-6 mb-1 mb-lg-0 ">
            <div className="d-flex align-items-center gap-2 flex-wrap w-100  justify-content-end">
              <select
                className="form-select border-1 rounded-2 px-2 py-1 w-50"
                name="status"
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter orders by status"
              >
                {["All", "PENDING", "IN_PROGRESS", "DELIVERED", "CANCELED"].map(
                  (status) => (
                    <option key={status} value={status}>
                      {status.toLowerCase().replace("_", " ")}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="row ">
          {data?.data?.length > 0 ? (
            data.data.map((item, idx) => (
              <div
                key={idx}
                className="col-12 col-lg-6 col-xl-4 d-flex justify-content-center"
              >
                <NavLink
                  to={`/orders/orderDetails/${item.id}`}
                  className={`orderCard mb-5 bg-white  rounded-3  d-block text-decoration-none text-dark w-100  ${
                    newOrderIds.has(item.id) ? "new-order" : ""
                  } ${
                    item.is_delivered ? "bg-success bg-opacity-10 shadow " : ""
                  }`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    transition: "all 0.3s ease",
                    fontSize: "0.9rem",
                    transform:
                      hoveredIndex === idx ? "scale(1.04)" : "scale(1)",
                    boxShadow:
                      hoveredIndex === idx
                        ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
                        : newOrderIds.has(item.id)
                        ? "none"
                        : "none",
                  }}
                >
                  <div
                    className="cardHeader rounded-3 px-3 py-4"
                    style={{
                      background:
                        item?.status === "DELIVERED"
                          ? "linear-gradient(to right, #9ddcd1 10%, #00a387 90%)"
                          : // : "linear-gradient(to right, #2471a5 10%, #80a8ce 90%)",
                            "linear-gradient(to left, #2471a5 10%, #80a8ce 90%)",
                    }}
                  >
                    <div className="items d-flex align-items-center justify-content-between">
                      <div className="left d-flex align-items-center gap-4">
                        <div
                          className="py-1 px-2 rounded-4 bg-opacity-10"
                          style={{
                            backgroundColor:
                              item?.order_type == "DeliveryRequest" ||
                              item?.order_type == "Delivery Request" ||
                              item?.order_type == "DeliveryRequest"
                                ? "#68859b"
                                : "#e9d5ff",
                            fontSize: "0.875rem",

                            color:
                              item?.order_type == "DeliveryRequest" ||
                              item?.order_type == "Delivery Request"
                                ? "white"
                                : "#8140b7",
                            fontWeight: "semibold",
                          }}
                        >
                          {item?.order_type == "DeliveryRequest" ||
                          item?.order_type == "Delivery Request"
                            ? "Delivery Request"
                            : "Order"}
                        </div>
                        <div
                          className={`py-1 px-lg-4 px-2 rounded-5  ${getStatusClass(
                            item.status
                          )}`}
                          style={{
                            fontWeight: "semibold",
                            border: "1px solid #b3b3bf",
                            fontSize: "0.9.3rem",
                          }}
                        >
                          {statusDisplay[item.status] || item.status}
                        </div>
                      </div>
                      <div
                        className="right py-1 rounded-3 px-md-4 px-2 fw-bold"
                        style={{
                          backgroundColor: "#589cc1",
                          color: "white",
                          fontSize: "0.875rem",
                          border: "1px solid #557ac1",
                        }}
                      >
                        {item?.total_price} EGP
                      </div>
                    </div>
                    <div className="headerFooter d-flex align-items-center justify-content-end mt-2">
                      <span className=" py-1 rounded-3 px-4 fw-bold text-white">
                        {" "}
                        #{item.code}
                      </span>
                    </div>
                  </div>
                  <div className="cardBody px-4 py-3">
                    <section className="timeline d-flex flex-column gap-2">
                      <div className="header">
                        <div className="d-flex align-items-center fw-bold gap-2 ">
                          <FontAwesomeIcon
                            icon={faClock}
                            className=" bg-white text-primary rounded-pill fs-5 "
                          />{" "}
                          Order Timeline
                        </div>
                      </div>
                      <div className="sectionBody  mt-2 d-flex flex-column gap-2 pb-3 border-bottom border-muted">
                        <div className="item d-flex align-items-center  justify-content-between">
                          <div
                            className="title d-flex align-items-center gap-2 text-muted"
                            style={{
                              fontWeight: "normal",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPlusCircle}
                              className="bg-white text-success rounded-pill"
                            />
                            Created{" "}
                          </div>
                          <div className="value fw-bold">
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                        {(item.is_picked || item.picked_at != null) && (
                          <div className="item d-flex align-items-center  justify-content-between">
                            <div
                              className="title d-flex align-items-center gap-2 text-muted"
                              style={{
                                fontWeight: "normal",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="bg-white text-success rounded-pill"
                              />
                              Picked{" "}
                            </div>
                            <div className="value fw-bold">
                              {item.picked_at != null &&
                                formatDate(item.picked_at)}
                            </div>
                          </div>
                        )}

                        {item?.is_delivered && item?.status == "DELIVERED" && (
                          <div className="item d-flex align-items-center  justify-content-between">
                            <div
                              className="title d-flex align-items-center gap-2 text-muted"
                              style={{
                                fontWeight: "normal",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="bg-white text-success rounded-pill"
                              />
                              Delivered{" "}
                            </div>
                            <div className="value fw-bold">
                              {formatDate(item.delivered_at)}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                    <section className="ReciverInfo mt-2">
                      <div className="header mb-3">
                        <div className="d-flex align-items-center fw-bold gap-2 ">
                          <FontAwesomeIcon
                            icon={faUserCircle}
                            className=" bg-white  rounded-pill fs-5 "
                            style={{ color: "8140b7" }}
                          />{" "}
                          Reciever Information
                        </div>
                      </div>
                      <div className="sectionBody  mt-2 d-flex flex-column gap-2 pb-3 border-bottom border-muted">
                        <div className="item d-flex align-items-center  justify-content-between">
                          <div
                            className="title d-flex align-items-center gap-2 text-muted"
                            style={{
                              fontWeight: "normal",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faUser}
                              className="bg-white text-muted rounded-pill"
                            />
                            Reciever Name{" "}
                          </div>
                          <div className="value fw-bold">
                            {item.receiver_name}
                          </div>
                        </div>
                        <div className="item d-flex align-items-center  justify-content-between">
                          <div
                            className="title d-flex align-items-center gap-2 text-muted"
                            style={{
                              fontWeight: "normal",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPhone}
                              className="bg-white text-muted rounded-pill"
                            />
                            Reciever Phone{" "}
                          </div>
                          <div className="value fw-bold">
                            {item.receiver_phone}
                          </div>
                        </div>
                      </div>
                    </section>
                    {(item.is_picked === true || item.picked_at != null) && (
                      <section className="TayarInfo mt-2">
                        <div className="header">
                          <div className="d-flex align-items-center fw-bold gap-2 ">
                            <FontAwesomeIcon
                              icon={faMotorcycle}
                              className=" bg-white text-primary rounded-pill fs-5 "
                            />{" "}
                            Delivery Crew
                          </div>
                        </div>
                        <div
                          className="sectionBody mt-3 d-flex align-items-center mb-3 pb-3"
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/tayareen/tayaarDetails/${item?.delivery_crew?.id}`
                              );
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon
                              icon={faUserCircle}
                              alt="Delivery crew member"
                              className="delivery-crew-image rounded-circle me-3"
                              style={{
                                width: "35px",
                                height: "35px",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          <div className="crew-info flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between">
                              <div
                                className="mb-1 fw-bold"
                                style={{ color: "var(--mainColor)" }}
                              >
                                {item.delivery_crew?.username || "Loading..."}
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon
                                icon={faPhone}
                                className="text-muted"
                              />
                              <span
                                className="text-muted"
                                style={{ color: "var(--mainColor)" }}
                              >
                                {item.delivery_crew?.phone_number ||
                                  "Loading..."}
                              </span>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                </NavLink>
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-5 w-100">
              No orders found.
            </div>
          )}
          <div className="mt-4">
            {data?.data?.length > 0 && (
              <div
                className="pagination-controls d-flex justify-content-center align-items-center gap-3"
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  margin: "0 auto",
                }}
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
                  aria-label="Previous page"
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
                  disabled={page * pageSize >= data?.count}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
