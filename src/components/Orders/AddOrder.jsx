import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export default function AddOrder({ onClose }) {
  const baseUrl = useSelector(selectBaseUrl);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 500;

  // const queryClient = new QueryClient();

  async function fetchShops() {
    try {
      const response = await axios.get(`${baseUrl}api/shops/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        params: {
          page: page,
          page_size: pageSize,
        },
      });
      console.log("Shops fetched successfully:", response?.data);
      return response?.data;
    } catch (error) {
      console.error("Error fetching shops:", error);
      //   toast.error("Error fetching shops.");
    }
  }

  const { data: shops, isLoading: shopsIsloading } = useQuery({
    queryKey: ["shops", page, pageSize],
    queryFn: fetchShops,
  });

  async function handleSubmit(values) {
    try {
      const response = await axios.post(
        `${baseUrl}api/delivery-requests/`,
        values,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Order created successfully:", response.data);
      // toast.success("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error("Error creating order.");
      console.error("Error creating order:", error);
    },
  });
  const validationSchema = Yup.object({
    request_shop: Yup.string()
      .required("Shop name is required")
      .oneOf(
        shops?.data?.map((shop) => String(shop?.id)) || [],
        "Invalid shop"
      ),

    receiver_name: Yup.string().required("Receiver name is required"),
    receiver_phone: Yup.string().required("Reveiver Phone is required"),
    price: Yup.number()
      .typeError("Total price must be a number")
      .positive("Total price must be positive")
      .required("Total price is required"),
  });

  const formik = useFormik({
    initialValues: {
      request_shop: "",
      receiver_name: " غير معروف",
      receiver_phone: "غير معروف",
      price: "غير معروف",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("values submitted", values);
      mutation.mutate(values);
    },
  });

  return (
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
          maxWidth: "900px",
          height: "auto",
          minHeight: "700px",
          animation: "slideUp 0.3s ease-in-out",
        }}
      >
        <div
          className="mb-4 text-muted fw-bold"
          style={{ fontSize: "1.2rem", textAlign: "center" }}
        >
          Add New Order Request
        </div>
        <form
          action=""
          className="d-flex flex-column justify-content-around  gap-3"
          onSubmit={formik.handleSubmit}
        >
          <div className="form-group mb-3 ">
            <label htmlFor="request_shop" className="text-muted mb-2">
              Select Shop (Required)
            </label>
            <select
              className="form-control mb-2"
              id="request_shop"
              name="request_shop"
              value={formik.values.request_shop}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" disabled>
                {shopsIsloading ? "Loading shops..." : "Select a shop"}
              </option>
              {!shopsIsloading &&
                shops?.data?.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop?.shop_name}
                  </option>
                ))}
            </select>
            {formik.touched.request_shop && formik.errors.request_shop && (
              <div className="text-danger">{formik.errors.request_shop}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="receiverName" className="text-muted mb-2">
              Receiver Name (Required)
            </label>
            <input
              className="form-control mb-2"
              id="receiverName"
              name="receiver_name"
              value={formik.values.receiver_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.receiver_name && formik.errors.receiver_name && (
              <div className="text-danger">{formik.errors.receiver_name}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="receiverPhone" className="text-muted mb-2">
              Receiver Phone (Required)
            </label>
            <input
              className="form-control mb-2"
              id="receiverPhone"
              name="receiver_phone"
              value={formik.values.receiver_phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.receiver_phone && formik.errors.receiver_phone && (
              <div className="text-danger">{formik.errors.receiver_phone}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="totalPrice" className="text-muted mb-2">
              Total Price (Required)
            </label>
            <input
              className="form-control mb-2"
              id="price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-danger">{formik.errors.price}</div>
            )}
          </div>

          <div className="btns d-flex justify-content-center align-items-center gap-3 mt-3 justify-self-end w-100">
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

            <button
              className="btn btn-secondary w-50"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Animation styles */}
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
  );
}
