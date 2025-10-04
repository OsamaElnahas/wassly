import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";

export default function AddTayar() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = useSelector(selectBaseUrl);

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      phone_number: "",
      national_id_image_front: null,
      national_id_image_back: null,
      crew_type: "",
      profile_picture: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      phone_number: Yup.string().required("Phone number is required"),
      national_id_image_front: Yup.mixed().required("Front image is required"),
      national_id_image_back: Yup.mixed().required("Back image is required"),
      crew_type: Yup.string()
        .required("Type is required")
        .oneOf(["طيار مستقل", "يعمل لدى وصلي"]),
      profile_picture: Yup.mixed().notRequired(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("phone_number", values.phone_number);
      formData.append("crew_type", values.crew_type);
      formData.append(
        "national_id_image_front",
        values.national_id_image_front
      );
      formData.append("national_id_image_back", values.national_id_image_back);
      if (values.profile_picture) {
        formData.append("profile_picture", values.profile_picture);
      }
      try {
        const response = await axios.post(
          `${baseUrl}api/crew/sign-up/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response);

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
          Add Driver
        </h2>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="fw-bold mb-2">Tayar Email</label>
            <input
              type="text"
              name="email"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </div>

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
            <label className="fw-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger">{formik.errors.password}</div>
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
          <div className="mb-3">
            <label className="fw-bold mb-2">Type</label>
            <select
              name="crew_type"
              className="form-select"
              onChange={formik.handleChange}
              value={formik.values.crew_type}
            >
              <option value="" label="Select type" />
              <option value="يعمل لدى وصلي">يعمل لدى وصلي</option>
              <option value="طيار مستقل">طيار مستقل</option>
            </select>
            {formik.touched.crew_type && formik.errors.crew_type && (
              <div className="text-danger">{formik.errors.crew_type}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="fw-bold mb-2">Profile Picture (Optional)</label>
            <input
              type="file"
              name="profile_picture"
              className="form-control"
              onChange={(event) => {
                formik.setFieldValue(
                  "profile_picture",
                  event.currentTarget.files[0]
                );
              }}
            />
            {formik.touched.profile_picture &&
              formik.errors.profile_picture && (
                <div className="text-danger">
                  {formik.errors.profile_picture}
                </div>
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
