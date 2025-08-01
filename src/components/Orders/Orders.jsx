// src/components/Orders.js
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import Errors from "../Error/Errors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";
import {
  faSearch,
  faCartArrowDown,
  faCircleRight,
  faFileCircleCheck,
  faCheck,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../supabaseClient";

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, "0");
  return `${day}-${month}-${year} | ${hours}:${minutes} ${ampm}`;
}

const translations = {
  yes: "نعم",
  no: "لا",
};

const statusDisplay = {
  PENDING: "قيد الانتظار",
  IN_PROGRESS: "قيد التنفيذ",
  DELIVERED: "تم التوصيل",
  CANCELED: "تم الالغاء",
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const pageSize = 10;
  const debounceRef = useRef(null);
  const queryClient = useQueryClient();
  const audioRef = useRef(new Audio("/assets/new_order.wav"));

  const baseUrl = useSelector(selectBaseUrl);

  // Preload audio
  useEffect(() => {
    audioRef.current.preload = "auto";
  }, []);

  // Invalidate query when baseUrl changes
  // useEffect(() => {
  //   console.log("Base URL changed to:", baseUrl); // Debug log
  //   queryClient.invalidateQueries(["orders"]);
  // }, [baseUrl, queryClient]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "text-warning bg-warning bg-opacity-10";
      case "IN_PROGRESS":
        return "text-primary bg-primary bg-opacity-10";
      case "DELIVERED":
        return "text-success bg-success bg-opacity-10";
      case "CANCELED":
        return "text-danger bg-danger bg-opacity-10";
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
      if (searchTerm) {
        params.search = searchTerm;
      }
      params.page = page;
      params.page_size = pageSize;
      console.log("Fetching orders with params:", params);
      console.log("Base URL:", baseUrl);

      const response = await axios.get(`${baseUrl}api/wassally/orders/`, {
        params: params,
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      console.log("API Response:", response.data);
      const { data, count } = response.data;
      return { data, count };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error.response?.data || error.message;
    }
  }

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["orders", statusFilter, page, pageSize, searchTerm],
    queryFn: getOrders,
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
    // cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  // Real-time subscription for new orders and updates
  useEffect(() => {
    const subscription = supabase
      .channel("wassally_wassallyorder_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wassally_wassallyorder",
        },
        (payload) => {
          const newOrder = payload.new;
          audioRef.current
            .play()
            .catch((err) => console.error("Error playing sound:", err));

          setNewOrderIds((prev) => new Set([...prev, newOrder.id]));
          setTimeout(() => {
            setNewOrderIds((prev) => {
              const updated = new Set(prev);
              updated.delete(newOrder.id);
              return updated;
            });
          }, 100 * 1000);

          queryClient.setQueryData(
            ["orders", statusFilter, page, pageSize, searchTerm],
            (oldData) => {
              if (!oldData) return { data: [newOrder], count: 1 };

              const matchesStatus =
                statusFilter === "All" || newOrder.status === statusFilter;
              const matchesSearch =
                !searchTerm ||
                newOrder.receiver_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                newOrder.receiver_phone
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                newOrder.code.toLowerCase().includes(searchTerm.toLowerCase());

              if (matchesStatus && matchesSearch && page === 1) {
                const newData = [newOrder, ...oldData.data].slice(0, pageSize);
                return {
                  ...oldData,
                  data: newData,
                  count: oldData.count + 1,
                };
              }
              return oldData;
            }
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wassally_wassallyorder",
        },
        (payload) => {
          console.log("Supabase INSERT payload:", payload.new); // Debug log
          const updatedOrder = payload.new;
          queryClient.setQueryData(
            ["orders", statusFilter, page, pageSize, searchTerm],
            (oldData) => {
              if (!oldData) return oldData;

              const matchesStatus =
                statusFilter === "All" || updatedOrder.status === statusFilter;
              const matchesSearch =
                !searchTerm ||
                updatedOrder.receiver_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                updatedOrder.receiver_phone
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                updatedOrder.code
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());

              if (matchesStatus && matchesSearch) {
                const updatedData = oldData.data.map((order) =>
                  order.id === updatedOrder.id ? updatedOrder : order
                );
                return {
                  ...oldData,
                  data: updatedData,
                };
              }
              return oldData;
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient, statusFilter, page, pageSize, searchTerm]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

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

      <div className="row align-items-center justify-content-between mb-4 gx-0">
        <div className="col-lg-6 col-12 mb-3 mb-lg-0">
          <div className="d-flex align-items-center gap-2 flex-wrap w-100">
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

        <div className="col-lg-6 col-12 mb-1 mb-lg-0">
          <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white position-relative w-100">
            <FontAwesomeIcon
              icon={faSearch}
              style={{ color: "var(--mainColor)", fontSize: "18px" }}
            />
            <input
              className="w-100 border-0 p-1"
              type="text"
              placeholder="Search by Receiver name, Receiver Phone or Order Code"
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
                  setPage(1);
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

      <div className="fw-bold my-4" style={{ color: "var(--mainColor)" }}>
        Orders ({data?.count || 0})
      </div>

      {isFetching && !isLoading && <Loader />}

      <div className="row g-3">
        {data?.data?.length > 0 ? (
          data.data.map((item, idx) => (
            <div key={item.id} className="col-12 col-lg-6">
              <NavLink
                to={`/orders/orderDetails/${item.id}`}
                className={`d-block order bg-white rounded p-2 h-100 text-muted ${
                  newOrderIds.has(item.id) ? "new-order" : ""
                } ${
                  item.is_delivered ? "bg-success bg-opacity-10 shadow " : ""
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transition: "all 0.3s ease",
                  transform: hoveredIndex === idx ? "scale(1.04)" : "scale(1)",
                  boxShadow:
                    hoveredIndex === idx
                      ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
                      : newOrderIds.has(item.id)
                      ? "none"
                      : "none",
                }}
              >
                <FontAwesomeIcon
                  icon={item?.is_delivered ? faCheckCircle : faCartArrowDown}
                  className="mb-2"
                  style={{ fontSize: "24px", color: "var(--mainColor)" }}
                />
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-bold">Order Type</div>
                  <div className="p-2 text-primary bg-primary bg-opacity-10 rounded-3">
                    {item?.order_type == "DeliveryRequest" ||
                    item?.order_type == "Delivery Request"
                      ? "Delivery Request"
                      : "Order"}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Status</div>
                  <div className={`rounded p-2 ${getStatusClass(item.status)}`}>
                    {statusDisplay[item.status] || item.status}
                  </div>
                </div>
                {item?.is_delivered && item?.status == "DELIVERED" && (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fw-bold">Delivered at</div>
                    <div className="p-2">{formatDate(item.delivered_at)}</div>
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Created at</div>
                  <div className="p-2">{formatDate(item.created_at)}</div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Picked</div>
                  <div
                    className={`p-2 ${
                      item.is_picked || item.picked_at != null
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {item.is_picked || item.picked_at != null
                      ? translations.yes
                      : translations.no}
                  </div>
                </div>
                {(item.is_picked || item.picked_at != null) && (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fw-bold">Picked at</div>
                    <div className={`p-2`}>
                      {item.picked_at != null && formatDate(item.picked_at)}
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Delivered</div>
                  <div
                    className={`p-2 ${
                      item.is_delivered ? "text-success" : "text-danger"
                    }`}
                  >
                    {item.is_delivered ? translations.yes : translations.no}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Receiver Name</div>
                  <div className="p-2">{item.receiver_name}</div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Receiver Phone</div>
                  <div className="p-2">{item.receiver_phone}</div>
                </div>
                {item?.is_picked && (
                  <>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="fw-bold">Tayaar Name</div>
                      <div className="p-2">{item.delivery_crew?.username}</div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="fw-bold">Tayaar Phone</div>
                      <div className="p-2">
                        {item.delivery_crew?.phone_number}
                      </div>
                    </div>
                  </>
                )}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Total Price</div>
                  <div className="p-2">{item?.total_price} EGP</div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fw-bold">Order Code</div>
                  <div className="p-2">{item.code}</div>
                </div>
              </NavLink>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p
              className="text-center text-muted"
              style={{ fontSize: "16px", fontWeight: "600" }}
            >
              {searchTerm
                ? `No orders found for "${searchTerm}"`
                : "No orders found"}
            </p>
          </div>
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
  );
}
