import React, { useState } from "react";
import axios from "axios";
import {
  Mutation,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import CheckStatus from "../Checker";

export default function AddTransactions({ isOpen, onClose }) {
  const baseUrl = useSelector(selectBaseUrl);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch transaction types
  async function fetchTransactionTypes() {
    try {
      const res = await axios.get(`${baseUrl}api/transaction-types/`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
        params: {
          page: 1,
          page_size: 15,
        },
      });
      return res?.data || [];
    } catch (error) {
      console.error("Error fetching transaction types:", error);
      throw error;
    }
  }

  const {
    data: transactionTypesList = [],
    isLoading: isLoadingTransactionTypes,
  } = useQuery({
    queryKey: ["transactionTypesList"],
    queryFn: fetchTransactionTypes,
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (values) => {
      setIsLoading(true);
      console.log("Adding transaction with values:", {
        transaction_type: Number(values.transaction_type_id),
        amount: values.amount,
        details: values.details,
      });
      const res = await axios.post(
        `${baseUrl}api/transactions/`,
        {
          //   ...values,
          transaction_type: values.transaction_type_id,
          amount: values.amount,
          details: values.details,
        },
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      return res.data;
    },
    mutationKey: ["createTransaction"],

    onSuccess: () => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log("Transaction added successfully");
      queryClient.invalidateQueries(["transactions"]);
      toast.success("Transaction added successfully");
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (error) => {
      setIsLoading(false);
      setIsSuccess(false);
      console.error(
        "Error adding transaction:",
        error.response?.data || error.message
      );
      toast.error("Error adding transaction");
    },
  });
  const formik = useFormik({
    initialValues: {
      transaction_type_id: "",
      amount: "",
      details: "",
    },
    validationSchema: Yup.object({
      transaction_type_id: Yup.number()
        .oneOf(
          transactionTypesList?.data?.data.map((type) => type.id),
          "Invalid transaction type"
        )
        .required("Transaction type is required"),
      amount: Yup.string()
        .required("Amount is required")
        .matches(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number"),
      details: Yup.string().optional(),
    }),
    onSubmit: (values) => {
      createTransactionMutation.mutate(values);
      // console.log("Form submitted with values:", values);
    },
    enableReinitialize: true, // Reinitialize when transactionTypesList changes
  });

  return (
    <>
      <div
        className="popup-overlay d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          animation: "fadeIn 0.3s ease-in-out",
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="popup-content shadow-lg d-flex flex-column gap-4"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "700px",
            minHeight: "500px",
            animation: "slideUp 0.3s ease-in-out",
          }}
        >
          <div
            className="mb-5 text-muted fw-bold text-center"
            style={{ fontSize: "1.4rem" }}
          >
            Add New Transaction Record
          </div>
          {isSuccess && <CheckStatus status="success" />}
          {isLoading && <CheckStatus status="loading" />}

          {!isSuccess && (
            <form onSubmit={formik.handleSubmit} className="w-100">
              <div className="form-group mb-3 d-flex flex-column gap-2">
                <label htmlFor="transactionType" className="text-muted">
                  Transaction Type (Required)
                </label>
                <select
                  className="border rounded-2 px-2 py-1  "
                  style={{
                    minHeight: "40px",
                    maxHeight: "400px",
                    overflowY: "scroll",
                  }}
                  name="transaction_type_id"
                  id="transactionType"
                  value={formik.values.transaction_type_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-describedby={
                    formik.touched.transaction_type_id &&
                    formik.errors.transaction_type_id
                      ? "transactionType-error"
                      : undefined
                  }
                  disabled={isLoadingTransactionTypes}
                >
                  <option value="" disabled className="p-1 mb-1 rounded-1">
                    {isLoadingTransactionTypes ? "Loading..." : "Select a type"}
                  </option>
                  {transactionTypesList?.data?.data.map((type) => (
                    <option key={type.id} value={type.id} className="p-1">
                      {type.name}
                    </option>
                  ))}
                </select>
                {formik.touched.transaction_type_id &&
                  formik.errors.transaction_type_id && (
                    <div id="transactionType-error" className="text-danger">
                      {formik.errors.transaction_type_id}
                    </div>
                  )}
              </div>

              <div className="form-group mb-3 d-flex flex-column gap-2">
                <label htmlFor="amount" className="text-muted">
                  Amount (Required)
                </label>
                <input
                  className="border rounded-2 px-2 py-1"
                  style={{ minHeight: "40px" }}
                  name="amount"
                  id=" przykładowy kod:amount"
                  placeholder="Enter amount EGP"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.amount && formik.errors.amount && (
                  <div className="text-danger">{formik.errors.amount}</div>
                )}
              </div>

              <div className="form-group mb-3 d-flex flex-column gap-2">
                <label htmlFor="details" className="text-muted">
                  Details (Optional)
                </label>
                <input
                  className="border rounded-2 px-2 py-1"
                  style={{ minHeight: "40px" }}
                  name="details"
                  id="details"
                  placeholder="Enter details"
                  value={formik.values.details}
                  onChange={formik.handleChange}
                />
                {formik.touched.details && formik.errors.details && (
                  <div className="text-danger">{formik.errors.details}</div>
                )}
              </div>

              <div
                className={`tns d-flex justify-content-center align-items-center gap-3 mt-5 w-100 cursor-pointer ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
              >
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  style={{
                    cursor:
                      !formik.isValid || !formik.dirty || formik.isSubmitting
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      !formik.isValid || !formik.dirty || formik.isSubmitting
                        ? 0.6
                        : 1,
                  }}
                >
                  {formik.isSubmitting ? "Loading..." : "Confirm"}
                </button>
                <button className="btn btn-secondary w-50" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          )}
          {isSuccess && (
            <div className="mt-5">
              <button
                className="btn btn-secondary w-100"
                onClick={onClose}
                disabled={isLoading}
              >
                Close
              </button>
            </div>
          )}

          <style>
            {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(30px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}
          </style>
        </div>
      </div>
    </>
  );
}
