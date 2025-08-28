import React, { useState } from "react";
import CheckStatus from "../Checker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectBaseUrl } from "../../features/api/apiSlice";

export default function AddNewType({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  //   const [isError, setIsError] = useState(false);
  const baseUrl = useSelector(selectBaseUrl);
  const queryClient = useQueryClient();

  const createTransactionTypeMutation = useMutation({
    mutationFn: async (values) => {
      setIsLoading(true);
      console.log("Adding transaction type with values:", values);
      const res = await axios.post(`${baseUrl}api/transaction-types/`, values, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      return res.data;
    },
    onSuccess: () => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Transaction type added successfully");
      console.log("Transaction type added successfully");
      queryClient.invalidateQueries(["transactionTypesList"]);
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (error) => {
      setIsLoading(false);
      setIsSuccess(false);
      console.error("Error adding transaction type:", error);
      toast.error("Error adding transaction type");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().optional(),
    }),
    onSubmit: (values) => {
      createTransactionTypeMutation.mutate(values);
    },
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
          className="popup-content shadow-lg"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "600px",
            minHeight: "300px",
            animation: "slideUp 0.3s ease-in-out",
          }}
        >
          <div
            className="mb-4 text-muted fw-bold text-center"
            style={{ fontSize: "1.2rem" }}
          >
            Add New Transaction Type
          </div>
          {isSuccess && <CheckStatus status="success" />}
          {isLoading && <CheckStatus status="loading" />}

          {!isLoading && !isSuccess && (
            <form onSubmit={formik.handleSubmit} className="w-100">
              <div className="form-group mb-3 d-flex flex-column gap-2">
                <label htmlFor="name" className="text-muted">
                  Name (Required)
                </label>
                <input
                  className="border rounded-2 px-2 py-1"
                  style={{ minHeight: "40px" }}
                  name="name"
                  id="name"
                  placeholder="Enter name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger">{formik.errors.name}</div>
                )}
              </div>

              <div className="form-group mb-3 d-flex flex-column gap-2">
                <label htmlFor="description" className="text-muted">
                  Description (Optional)
                </label>
                <input
                  className="border rounded-2 px-2 py-1"
                  style={{ minHeight: "40px" }}
                  name="description"
                  id="description"
                  placeholder="Enter description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-danger">{formik.errors.description}</div>
                )}
              </div>

              <div className="btns d-flex justify-content-center align-items-center gap-3 mt-5 w-100">
                <button
                  className="btn btn-primary w-50"
                  type="submit"
                  disabled={isLoading}
                >
                  Confirm
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
        </div>

        {/* Animation styles */}
      </div>
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
    </>
  );
}
