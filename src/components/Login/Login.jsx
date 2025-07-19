import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import logo from "../../images/logoo.webp";
import backImg from "../../images/ChatGPT Image Apr 14, 2025, 06_53_40 AM.png";
import axios from "axios";
import "animate.css";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string("please enter avalid name").required("Required"),
      password: Yup.string().min(5, "min 5 charachters").required("Required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await axios.post(
          "https://wassally.onrender.com/api/staff/login/",
          values
        );
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.data.username);
        navigate("/");
        console.log(res);
      } catch (error) {
        setError(
          error.response?.data?.message?.en || "Incorrect Username or Password"
        );
        navigate("/login");
      }
      setIsLoading(false);
    },
  });

  return (
    <div
      className={` min-vh-100 d-flex align-items-center justify-content-center bg-light ${
        isLoading && !error
          ? "animate__animated animate__fadeOut animate__delay-1s "
          : ""
      }`}
    >
      <div className="container">
        <div
          className="text-center mb-5 fs-1 fs-md-2 fw-bold animate__animated animate__fadeIn animate__delay-0.5s animate__zoomIn"
          style={{ color: "var(--mainColor)", fontSize: "2rem" }}
        >
          Welcome to Wassally Dashboard
        </div>
        <div className="row gx-0 shadow rounded overflow-hidden flex-row-reverse h-100  animate__animated animate__fadeIn animate__delay-1s animate__zoomIn  ">
          {/* Image Section */}
          <div className="col-md-8 d-none d-md-block position-relative">
            <img
              src={backImg}
              alt=""
              className="w-100 h-100 object-fit-cover"
            />
            <div
              className="position-absolute  fs-3 fw-bold"
              style={{ bottom: "5%", right: "10%", color: "var(--mainColor)" }}
            >
              Power up your workflow
            </div>
          </div>

          {/* Login Form Section */}
          <div className="col-md-4 col-12 bg-white  p-4    ">
            <div className="d-flex flex-column  h-100 ">
              <div className="d-flex align-items-center mb-4  justify-content-center gap-2  w-100">
                <div
                  className="d-flex justify-content-center align-items-center "
                  style={{
                    width: "5.5rem",
                    height: "5.5rem",
                    backgroundColor: "var(--mainColor)",
                    borderRadius: "50%",
                    padding: "1rem",
                  }}
                >
                  <img
                    src={logo}
                    alt="logo"
                    style={{ width: "100%", height: "60%" }}
                  />
                </div>
                <span
                  className=" fw-bold flex-1 fs-5 fs-md-4"
                  style={{ color: "var(--mainColor)" }}
                >
                  Dashboard
                </span>
              </div>

              <form
                onSubmit={formik.handleSubmit}
                className="d-flex flex-column gap-4 justify-content-center  h-100"
              >
                <div className="mb-2">
                  <input
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    placeholder="Enter Your User Name"
                    className="form-control"
                  />
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-danger small mt-2">
                      {formik.errors.username}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="password"
                    placeholder="Enter Your Password"
                    className="form-control"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-danger small mt-2">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-5"
                  style={{ backgroundColor: "var(--mainColor)" }}
                >
                  {isLoading ? (
                    <div className="d-flex justify-content-center">
                      <ColorRing
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
                      />
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>

                {error && <p className="text-danger mt-3">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
