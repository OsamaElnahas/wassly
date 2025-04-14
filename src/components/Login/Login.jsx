import React, { useState } from 'react';
import styles from "./Login.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import logo from "../../images/logoo.webp"
import backImg from "../../images//ChatGPT Image Apr 14, 2025, 06_53_40 AM.png"
import axios from 'axios';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)

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
      setIsLoading(true)
      try {
        const res = await axios.post("https://wassally.onrender.com/api/staff/login/", values);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.data.username);
        navigate("/");
        console.log(res);
        
      } catch (error) {
        setError(error.response?.data?.message || "Incorrect Username or Password");
      }
      setIsLoading(false)
    }
  });
  

  return (
    <div className={styles.overlay}>
      <div className="container">
       
        <div className={` ${styles.parent} row gx-0 `}>
          <div className={` ${styles.ImagePart} col-md-8 col-12 `}>
            <img src={backImg} alt="" />
            <div className={` ${styles.description}`}>Power up your workflow</div>
          </div>
          <div className={`${styles.rightSide} col-md-4 col-12`}>
            <div className={styles.head}><img src={logo} alt="logo" /><span className={styles.title}>Dashboard</span> </div>

          <form onSubmit={formik.handleSubmit} className={` ${styles.form}`}>
            <input
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Your User Name"
            />
            {formik.touched.username && formik.errors.username && <p>{formik.errors.username}</p>}

            <input
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder="Enter Your Password"
              />
            {formik.touched.password && formik.errors.password && <p>{formik.errors.password}</p>}

            <button type="submit" className="btn">
            {isLoading? <ColorRing
            visible={true}
            height="40"
            width="40"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
            />:"Login"}
            </button>
            {error && <p>{error}</p>}
          </form>
            </div>
        </div>
      </div>
    </div>
  );
}
