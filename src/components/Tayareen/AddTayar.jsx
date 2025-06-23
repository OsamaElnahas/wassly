import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";

export default function AddTayar() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      phone_number: "",
      national_id_image_front: null,
      national_id_image_back: null,
      type:""
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      phone_number: Yup.string().required("Phone number is required"),
      national_id_image_front: Yup.mixed().required("Front image is required"),
      national_id_image_back: Yup.mixed().required("Back image is required"),
        type: Yup.string().required("Type is required").oneOf(["طيار مستقل", "يعمل لدى وصلي"]),
    }),
    onSubmit: async (values) => {
    //   console.log("data to be sent", values);
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://wassally.onrender.com/api/crew/sign-up/",
          values,
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        console.log("Response:", response);

        if (response.status === 201) {
          toast.success("Tayaar created successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/tayareen");
          }, 1000);
        }
      } catch (err) {
        console.log(err);
        const errorMessage =
          err.response?.data?.message || "Failed to create Tayaar";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h2
          className="mb-5 fw-bold"
          style={{
            color: "var(--mainColor)",
          }}
        >
          Add Tayar
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="fw-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-danger">{formik.errors.username}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.phone_number}
            />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <div className="text-danger">{formik.errors.phone_number}</div>
            )}
          </div>
            <div className="mb-3">
                <label className="fw-bold mb-2">National ID Image (Front)</label>
                <input
                type="file"
                name="national_id_image_front"
                className="form-control"
                onChange={(event) => {
                    formik.setFieldValue(
                    "national_id_image_front",
                    event.currentTarget.files[0]
                    );
                }}
                />
                {formik.touched.national_id_image_front &&
                formik.errors.national_id_image_front && (
                    <div className="text-danger">
                    {formik.errors.national_id_image_front}
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label className="fw-bold mb-2">National ID Image (Back)</label>
                <input
                type="file"
                name="national_id_image_back"
                className="form-control"
                onChange={(event) => {
                    formik.setFieldValue(
                    "national_id_image_back",
                    event.currentTarget.files[0]
                    );
                }}
                />
                {formik.touched.national_id_image_back &&
                formik.errors.national_id_image_back && (
                    <div className="text-danger">
                    {formik.errors.national_id_image_back}
                    </div>
                )}
            </div>
            <div className="mb-5">
                <label className="fw-bold mb-2">Type</label>
                <select
                    name="type"
                    className="form-select"
                    onChange={formik.handleChange}
                    value={formik.values.type}
                >
                    <option value="" label="Select type" />
                    <option value="يعمل لدى وصلي">يعمل لدى وصلي</option>
                    <option value="طيار مستقل">طيار مستقل</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                    <div className="text-danger">{formik.errors.type}</div>
                )}
            </div>

        

          <div className="mt-5">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? <ColorRing height={20} width={20} /> : "Add Tayaar"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}