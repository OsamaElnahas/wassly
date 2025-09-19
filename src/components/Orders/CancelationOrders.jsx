import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faCheckSquare,
  faTimes,
  faCheckCircle,
  faUser,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";
import { NavLink, useOutletContext } from "react-router-dom";
import Loader from "../Loader/Loader";
import { formatDate } from "./Orders";
import { toast } from "react-toastify";

export default function CancelationOrders() {
  const baseUrl = useSelector(selectBaseUrl);
  const queryClient = useQueryClient();
  const { searchTerm, setSearchTerm } = useOutletContext();
  const [cardIndex, setCardIndex] = useState(null);
  const [id, setid] = useState(null);
  const [amount, setAmount] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  async function getCancelation() {
    try {
      const response = await axios.get(
        `${baseUrl}api/wassally/order/cancellation-requests/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          params: {
            page: page,
            page_size: pageSize,
          },
        }
      );
      console.log(
        "Cancellation requests fetched successfully:",
        response?.data?.data
      );
      return response?.data?.data;
    } catch (error) {
      console.error("Error fetching cancellation requests:", error);
      throw error;
    }
  }
  const { data: cancelations, isLoading: cancelationsIsloading } = useQuery({
    queryKey: ["cancelations", page, pageSize],
    queryFn: getCancelation,
  });
  const mutationReject = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.post(
          `${baseUrl}api/wassally/order/cancellation-requests/${id}/reject/`,
          {}, // body فاضي
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(
          "Cancellation request rejected successfully:",
          response?.data
        );
        return response?.data;
      } catch (error) {
        console.error("Error rejecting cancellation request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancelations"] });
      toast.success("Order Rejected!");
    },
    onError: () => {
      toast.error("Error rejecting order.");
    },
  });
  const mutationApprove = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.post(
          `${baseUrl}api/wassally/order/cancellation-requests/${id}/approve/`,
          { amount_to_refund: amount },
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(
          "Cancellation request approved successfully:",
          response?.data
        );
        return response?.data;
      } catch (error) {
        console.error("Error approving cancellation request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancelations"] });
      toast.success("Order Approved!");
      setCardIndex(null);
      setAmount(null);
    },
    onError: () => {
      toast.error("Error approving order.");
      setCardIndex(null);
      setAmount(null);
    },
  });
  if (cancelationsIsloading) {
    return <Loader />;
  }

  return (
    <div
      className="px-3 px-sm-2 d-flex flex-column  justify-content-center gap-1 w-100"
      style={{ maxWidth: "1500px", margin: "0 auto" }}
    >
      {/* Cancellation Requests Section */}
      <div
        className="fw-bold mb-4"
        style={{ color: "var(--mainColor)", fontSize: "1rem" }}
      >
        Cancellation Requests ({cancelations?.count})
      </div>

      <div className="row g-3">
        {cancelations?.data?.length === 0 && !cancelationsIsloading ? (
          <div className="text-center py-4 mt-4">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-success mb-3"
              style={{ fontSize: "3rem" }}
            />
            <p className="text-muted">No pending cancellation requests</p>
          </div>
        ) : (
          cancelations?.data?.map((order, index) => (
            <div className="col-12" key={index}>
              <div
                className="cancellation-card bg-white rounded p-3 h-100"
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  borderLeft: "4px solid red",
                }}
              >
                {/* Card Header */}
                <div
                  className="card-header d-flex align-items-center mb-3 pb-3 gap-3"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <NavLink
                    to={`/tayareen/tayaarDetails/${order?.requested_by?.id}`}
                    className="crew-avatar d-flex align-items-center justify-content-center bg-light rounded-circle"
                  >
                    <FontAwesomeIcon icon={faUser} className="fs-1" />
                  </NavLink>

                  <div className="crew-info flex-grow-1 d-flex flex-column gap-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2 fw-bold">
                        {order?.requested_by?.username}
                      </div>
                      <span className="badge bg-warning text-dark">
                        {order?.status}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-primary fs-5"
                      />
                      <div
                        className="text-decoration-none"
                        style={{ color: "var(--mainColor)" }}
                      >
                        {order?.requested_by?.phone_number}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason Section */}
                <div className="reason-section mb-3">
                  <label className="fw-bold mb-2 d-block">
                    Cancellation Reason
                  </label>
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      minHeight: "80px",
                    }}
                  >
                    {order?.reason || "No reason provided"}
                  </div>
                </div>

                {/* Order Info */}
                <div className="order-info mb-4">
                  <div className="row">
                    <div className="col-12 fw-bold mb-2">
                      Delivery Fee :{order?.order?.delivery_fee} EGP
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 d-flex align-items-center gap-3 mb-3 mb-lg-0 col-lg-6">
                      <small className="text-muted d-block">Order Code</small>
                      <strong>#{order?.order?.code}</strong>
                      <NavLink
                        to={`/orders/orderDetails/${order?.order?.id}`}
                        className="text-primary bg-white rounded-pill border border-primary text-center d-inline-block px-3 py-1 mt-2  ml-2 pointer"
                      >
                        View Order
                      </NavLink>
                    </div>
                    <div className="col-12 d-flex align-items-center gap-3 mb-3 mb-lg-0 col-lg-6">
                      <small className="text-muted d-block">Requested At</small>
                      <strong>{formatDate(order?.created_at)}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {cardIndex === index && (
                  <div className=" mt-3 d-flex flex-column  justify-content-center gap-3 mb-3">
                    <input
                      type="text"
                      id="amount"
                      className="form-control d-inline-block w-auto mx-2"
                      style={{ minWidth: "150px" }}
                      placeholder="Enter refund amount"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="buttons-container d-flex justify-content-end w-100 ">
                      <div className="action-buttons d-flex gap-4 ">
                        <button
                          className="btn btn-primary flex-fill  rounded-pill px-4 d-flex align-items-center justify-content-center gap-1"
                          style={{
                            // backgroundColor: "#28b363",
                            border: "none",
                            padding: "10px",
                            width: "fit-content",
                          }}
                          onClick={() => mutationApprove.mutate(id)}
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className=" rounded-pill p-1"
                          />
                          Confirm
                        </button>
                        <button
                          className=" bg-muted flex-fill rounded-pill px-3"
                          onClick={() => {
                            setCardIndex(null);
                            setAmount(null);
                          }}
                          style={{
                            border: "none",
                            padding: "10px",
                            width: "fit-content",
                            backgroundColor: "##bc372a",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="me-2 bg-muted"
                          />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {order?.status !== "REJECTED" &&
                  order?.status !== "APPROVED" &&
                  cardIndex === null && (
                    <div className="buttons-container d-flex justify-content-end w-100 ">
                      <div className="action-buttons d-flex gap-4 ">
                        <button
                          className="btn btn-success flex-fill  rounded-pill px-4 d-flex align-items-center justify-content-center gap-1"
                          style={{
                            backgroundColor: "#28b363",
                            border: "none",
                            padding: "10px",
                            width: "fit-content",
                          }}
                          onClick={() => {
                            setCardIndex(index);
                            setid(order?.id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className=" rounded-pill p-1"
                          />
                          Accept
                        </button>
                        <button
                          className="btn btn-danger flex-fill rounded-pill px-3"
                          onClick={() => mutationReject.mutate(order?.id)}
                          style={{
                            border: "none",
                            padding: "10px",
                            width: "fit-content",
                            backgroundColor: "##bc372a",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="me-2 bg-danger"
                          />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State Example */}
      {/* <div className="text-center py-4 mt-4">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-success mb-3"
          style={{ fontSize: "3rem" }}
        />
        <p className="text-muted">No pending cancellation requests</p>
      </div> */}
      <div className="mt-4">
        {cancelations?.data?.length > 0 && (
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
              disabled={page * pageSize >= cancelations?.count}
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
