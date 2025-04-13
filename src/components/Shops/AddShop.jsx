import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import Errors from "../Error/Errors";
import toast, { Toaster } from 'react-hot-toast';
import styles from "../../styles/sharedForm.module.css";

export default function AddShop() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [isPost, setIsPost] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const navigate=useNavigate()

  function clicked(){
    setIsClicked(!clicked)
  }

  const formik = useFormik({
    initialValues: {
        username: "",
        phone_number: "",
        shop: {
          shop_name: "",
          shop_description: "",
          shop_location: {
            address: "",
            longitude: "",
            latitude: ""
          },
          shop_phone_number: "",
          shop_facebook_url:"", 
          shop_category: "",
        }
    },
    validationSchema: Yup.object({
      username:Yup.string().required("user name is required"),
      phone_number:Yup.string().required("Phone number is required"),
      shop:Yup.object({
          shop_name: Yup.string().required("Required"),
          shop_description: Yup.string().required("Required"),
          shop_location: Yup.object({
            address: Yup.string().required("Required"),
            longitude: Yup.number().required("Required"),
            latitude: Yup.number().required("Required"),
          }),
          shop_phone_number: Yup.string().required("Required"),
          shop_facebook_url: Yup.string(),
          shop_category: Yup.number()
      })
    }),

    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const response = await axios.post("http://localhost:8000/api/shops/", values);
        if (response.status === 201) {
          setIsPost(true);
          toast.success("Shop added successfully!");
          setTimeout(() => {
            navigate("/shops");
          }, 2000);
        }
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="container">
      <div className={styles.formContainer}>
        <div className={styles.formTitle}>Add Shop</div>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <input
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Enter Your user Name"
            className={styles.formInput}
          />
          {formik.touched.username && formik.errors.username && (
            <p className={styles.formError}>{formik.errors.username}</p>
          )}
          <input
            name="phone_number"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Enter Your phone Number"
            className={styles.formInput}
          />
          {formik.touched.phone_number && formik.errors.phone_number && (
            <p className={styles.formError}>{formik.errors.phone_number}</p>
          )}
          <input
            name="shop.shop_name"
            value={formik.values.shop?.shop_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Enter Your Shop Name"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_name && formik.errors.shop_name && (
            <p className={styles.formError}>{formik.errors.shop?.shop_name}</p>
          )}
          <input
            name="shop.shop_description"
            value={formik.values.shop?.shop_description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Enter Shop Description"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_description &&
            formik.errors.shop?.shop_description && (
              <p className={styles.formError}>{formik.errors.shop?.shop_description}</p>
            )}

          <input
            name="shop.shop_location.address"
            value={formik.values.shop?.shop_location?.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Enter Shop Location"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_location?.address &&
            formik.errors.shop?.shop_location?.address && (
              <p className={styles.formError}>{formik.errors.shop?.shop_location?.address}</p>
            )}

          <input
            name="shop.shop_location.latitude"
            value={formik.values.shop?.shop_location?.latitude}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            placeholder="Enter Shop latitude"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_location?.latitude &&
            formik.errors.shop?.shop_location?.latitude && (
              <p className={styles.formError}>{formik.errors.shop?.shop_location?.latitude}</p>
            )}
          <input
            name="shop.shop_location.longitude"
            value={formik.values.shop?.shop_location?.longitude}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            placeholder="Enter Shop longituder"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_location?.longitude &&
            formik.errors.shop?.shop_location?.longitude && (
              <p className={styles.formError}>{formik.errors.shop?.shop_location?.longitude}</p>
            )}

          <input
            name="shop.shop_phone_number"
            value={formik.values.shop?.shop_phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Enter Shop Number"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_phone_number &&
            formik.errors.shop?.shop_phone_number && (
              <p className={styles.formError}>{formik.errors.shop?.shop_phone_number}</p>
            )}

          <input
            name="shop.shop_facebook_url"
            value={formik.values.shop?.shop_facebook_url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Enter Shop Facebook URL"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_facebook_url &&
            formik.errors.shop?.shop_facebook_url && (
              <p className={styles.formError}>{formik.errors.shop?.shop_facebook_url}</p>
            )}
          <input
            name="shop.shop_category"
            value={formik.values.shop?.shop_category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            placeholder="Enter Shop cetegory"
            className={styles.formInput}
          />
          {formik.touched.shop?.shop_category && formik.errors.shop_category && (
            <p className={styles.formError}>{formik.errors.shop?.shop_category}</p>
          )}

          <button type="submit" className={styles.formButton}>
            {isLoading ? (
              <ColorRing
                visible={true}
                height="40"
                width="40"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
              />
            ) : "Add"}
          </button>
          {clicked && (
            <>
              {error && !isPost ? <p className={styles.formError}>{error}</p> : ""}
              <Toaster/>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
