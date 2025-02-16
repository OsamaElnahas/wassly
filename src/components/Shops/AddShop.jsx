import styles from "./addShop.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import Errors from "../Error/Errors";
import toast, { Toaster } from 'react-hot-toast';


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
    //   owner: Yup.string(),
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
          console.log("Sending data:", JSON.stringify(values, null, 2));
          const res = await axios.post(
            "https://wassally.onrender.com/api/bussiness-owner-sign-up/",
            values,
            {
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );
          console.log("addedSuccesfuly", res);
          console.log(error);
          setIsPost(true)
          formik.resetForm();
          
          
        } catch (error) {
        setIsPost(false);
        console.log(error,"from catch");
        

        if (!error.response) {
          setError("No Internet Connection");
        } else {
          const status = error.response.status;

          if (status === 401 || status === 403) {
            setError("Unauthorized Access");
          } else if (status === 404) {
            setError("Not Found");
          } else if (status >= 500) {
            setError("Server Error, Please Try Again");
          } else {
            setError(error.response?.data?.errors?.non_field_errors || "Something went wrong!");
          }
        }
      }
      setIsLoading(false)

    },
  });
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isPost) {
      toast.success("Shop added successfully!");
      setTimeout(()=>navigate("/Shops"),2000)

    }
  }, [isPost]);

  
  return (
    <div className="container">
      
      
        <div className={styles.parent}>
          <div className={styles.title}>Add Shop</div>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            {/* <input
              name="owner"
              value={formik.values.owner}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Owner Name"
            />
            {formik.touched.owner && formik.errors.owner && (
              <p>{formik.errors.owner}</p>
            )} */}
            <input
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Your user Name"
              />
            {formik.touched.username && formik.errors.username && (
              <p>{formik.errors.username}</p>
            )}
            <input
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Your phone Number"
              />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <p>{formik.errors.phone_number}</p>
            )}
            <input
              name="shop.shop_name"
              value={formik.values.shop?.shop_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Your Shop Name"
            />
            {formik.touched.shop?.shop_name && formik.errors.shop_name && (
              <p>{formik.errors.shop?.shop_name}</p>
            )}
            <input
              name="shop.shop_description"
              value={formik.values.shop?.shop_description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Shop Description"
            />
            {formik.touched.shop?.shop_description &&
              formik.errors.shop?.shop_description && (
                <p>{formik.errors.shop?.shop_description}</p>
              )}

            <input
              name="shop.shop_location.address"
              value={formik.values.shop?.shop_location?.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Shop Location"
            />
            {formik.touched.shop?.shop_location?.address &&
              formik.errors.shop?.shop_location?.address && (
                <p>{formik.errors.shop?.shop_location?.address}</p>
              )}

            <input
              name="shop.shop_location.latitude"
              value={formik.values.shop?.shop_location?.latitude}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              placeholder="Enter Shop latitude"
            />
            {formik.touched.shop?.shop_location?.latitude &&
              formik.errors.shop?.shop_location?.latitude && (
                <p>{formik.errors.shop?.shop_location?.latitude}</p>
              )}
            <input
              name="shop.shop_location.longitude"
              value={formik.values.shop?.shop_location?.longitude}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              placeholder="Enter Shop longituder"
            />
            {formik.touched.shop?.shop_location?.longitude &&
              formik.errors.shop?.shop_location?.longitude && (
                <p>{formik.errors.shop?.shop_location?.longitude}</p>
              )}

            <input
              name="shop.shop_phone_number"
              value={formik.values.shop?.shop_phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Shop Number"
              />
            {formik.touched.shop?.shop_phone_number &&
              formik.errors.shop?.shop_phone_number && (
                <p>{formik.errors.shop?.shop_phone_number}</p>
              )}

            <input
              name="shop.shop_facebook_url"
              value={formik.values.shop?.shop_facebook_url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter Shop Facebook URL"
            />
            {formik.touched.shop?.shop_facebook_url &&
              formik.errors.shop?.shop_facebook_url && (
                <p>{formik.errors.shop?.shop_facebook_url}</p>
              )}
            <input
              name="shop.shop_category"
              value={formik.values.shop?.shop_category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              placeholder="Enter Shop cetegory"
            />
            {formik.touched.shop?.shop_category && formik.errors.shop_category && (
              <p>{formik.errors.shop?.shop_category}</p>
            )}

            <button type="submit" className="btn">
                  {isLoading? <ColorRing
                          visible={true}
                          height="40"
                          width="40"
                          ariaLabel="color-ring-loading"
                          wrapperStyle={{}}
                          wrapperClass="color-ring-wrapper"
                          colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                              />:"Add"}
            </button>
                      {clicked && (
                        <>
              {error && !isPost? <p className="text-danger fw-bold">{error}</p>:""}
            

<Toaster/>
              </>
              )}

          </form>
        </div>
      </div>
  );
}
