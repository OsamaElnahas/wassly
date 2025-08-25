import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";
import { useQuery } from "@tanstack/react-query";

export default function AddOrder({ onClose }) {
  const baseUrl = useSelector(selectBaseUrl);

  async function fetchShops() {
    try {
      const response = await axios.get(`${baseUrl}api/shops/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
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
    queryKey: ["shops"],
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
      toast.success("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error creating order.");
    }
  }
  const validationSchema = Yup.object({
    shop_id: Yup.string().required("Shop name is required"),
    // .oneOf(
    //   shops?.data?.map((shop) => shop?.id),
    //   "Invalid shop id"
    // ),
  });

  const formik = useFormik({
    initialValues: {
      request_shop: {
        shop_name: "",
        shop_description: "",
        shop_location: {
          address: "",
        },
      },
      location: {
        address: "",
      },
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("values submitted", values);
      handleSubmit(values);
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
          maxWidth: "600px",
          minHeight: "300px",
          animation: "slideUp 0.3s ease-in-out",
        }}
      >
        <div
          className="mb-4 text-muted fw-bold"
          style={{ fontSize: "1.2rem", textAlign: "center" }}
        >
          Add New Order Request
        </div>
        <form action="">
          <div className="form-group mb-3">
            <label htmlFor="shopName" className="text-muted mb-2">
              Select Shop (Required)
            </label>
            <select
              className="form-control mb-2"
              id="shopName"
              name=""
              value={formik.values.shop_name}
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
            {formik.touched.request_shop?.shop_name &&
              formik.errors.request_shop?.shop_name && (
                <div className="text-danger">
                  {formik.errors.request_shop.shop_name}
                </div>
              )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="receiverName" className="text-muted mb-2">
              Receiver Name (optional)
            </label>
            <input
              className="form-control mb-2"
              id="receiverName"
              name="request_shop.receiver_name"
              value={formik.values.request_shop.receiver_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.request_shop?.receiver_name &&
              formik.errors.request_shop?.receiver_name && (
                <div className="text-danger">
                  {formik.errors.request_shop.receiver_name}
                </div>
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
              Total Price (optional)
            </label>
            <input
              className="form-control mb-2"
              id="totalPrice"
              name="total_price"
              value={formik.values.total_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.total_price && formik.errors.total_price && (
              <div className="text-danger">{formik.errors.total_price}</div>
            )}
          </div>

          <div className="btns d-flex justify-content-center align-items-center gap-3 mt-3 w-100">
            <button className="btn btn-primary w-50">Confirm</button>
            <button className="btn btn-secondary w-50" onClick={onClose}>
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
