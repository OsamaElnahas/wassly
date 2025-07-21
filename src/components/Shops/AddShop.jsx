import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from 'react-redux';
import { selectBaseUrl } from '../../features/api/apiSlice';

export default function AddShop() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [position, setPosition] = useState({ lat: 30.0444, lng: 31.2357 }); // Default to Cairo, Egypt
  const [address, setAddress] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const baseUrl = useSelector(selectBaseUrl);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const egyptBounds = {
            north: 31.7,
            south: 22.0,
            west: 24.7,
            east: 36.9,
          };
          if (
            latitude >= egyptBounds.south &&
            latitude <= egyptBounds.north &&
            longitude >= egyptBounds.west &&
            longitude <= egyptBounds.east
          ) {
            setPosition({ lat: latitude, lng: longitude });
            formik.setFieldValue("shop.shop_location.latitude", latitude);
            formik.setFieldValue("shop.shop_location.longitude", longitude);
            fetchAddress(latitude, longitude);
          } else {
            toast.error("Location outside Egypt. Using default (Cairo).");
            fetchAddress(30.0444, 31.2357);
          }
        },
        () => {
          toast.error("Could not fetch location. Using default (Cairo).");
          fetchAddress(30.0444, 31.2357);
        }
      );
    } else {
      toast.error("Geolocation not supported. Using default (Cairo).");
      fetchAddress(30.0444, 31.2357);
    }
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAIsV8XbX_RjYEBJYveFkDgZTBxOvL_wMQ`
      );
      const data = await res.json();
      const fetchedAddress = data.results[0]?.formatted_address || "Address not found";
      setAddress(fetchedAddress);
      formik.setFieldValue("shop.shop_location.address", fetchedAddress);
    } catch {
      formik.setFieldValue("shop.shop_location.address", "Address not found");
    }
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const egyptBounds = {
      north: 31.7,
      south: 22.0,
      west: 24.7,
      east: 36.9,
    };
    if (
      lat >= egyptBounds.south &&
      lat <= egyptBounds.north &&
      lng >= egyptBounds.west &&
      lng <= egyptBounds.east
    ) {
      setPosition({ lat, lng });
      formik.setFieldValue("shop.shop_location.latitude", lat);
      formik.setFieldValue("shop.shop_location.longitude", lng);
      fetchAddress(lat, lng);
    } else {
      toast.error("Please select a location within Egypt.");
    }
  };

  const onSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchValue + ", Egypt" }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const egyptBounds = {
          north: 31.7,
          south: 22.0,
          west: 24.7,
          east: 36.9,
        };
        if (
          lat >= egyptBounds.south &&
          lat <= egyptBounds.north &&
          lng >= egyptBounds.west &&
          lng <= egyptBounds.east
        ) {
          setPosition({ lat, lng });
          formik.setFieldValue("shop.shop_location.latitude", lat);
          formik.setFieldValue("shop.shop_location.longitude", lng);
          fetchAddress(lat, lng);
        } else {
          toast.error("Location outside Egypt.");
        }
      } else {
        toast.error("Location not found in Egypt.");
      }
    });
  };

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const egyptBounds = {
            north: 31.7,
            south: 22.0,
            west: 24.7,
            east: 36.9,
          };
          if (
            latitude >= egyptBounds.south &&
            latitude <= egyptBounds.north &&
            longitude >= egyptBounds.west &&
            longitude <= egyptBounds.east
          ) {
            setPosition({ lat: latitude, lng: longitude });
            formik.setFieldValue("shop.shop_location.latitude", latitude);
            formik.setFieldValue("shop.shop_location.longitude", longitude);
            fetchAddress(latitude, longitude);
            toast.success("Current location detected.");
          } else {
            toast.error("Current location outside Egypt. Using default (Cairo).");
            setPosition({ lat: 30.0444, lng: 31.2357 });
            fetchAddress(30.0444, 31.2357);
          }
        },
        () => {
          toast.error("Could not fetch current location.");
        }
      );
    } else {
      toast.error("Geolocation not supported.");
    }
  };

  const formik = useFormik({
    initialValues: {
      email:"",
      username: "",
      phone_number: "",
      shop: {
        shop_name: "",
        shop_description: "",
        shop_phone_number: "",
        shop_facebook_url: "",
        shop_category: null,
        status: "Online",
        shop_location: {
          address: "",
          latitude: 0,
          longitude: 0,
        },
      },
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      username: Yup.string().required("Username is required"),
      phone_number: Yup.string().required("Phone number is required"),
      shop: Yup.object({
        shop_name: Yup.string().required("Shop name is required"),
        shop_description: Yup.string().required("Shop description is required"),
        shop_phone_number: Yup.string().required("Shop phone number is required"),
        shop_facebook_url: Yup.string().url("Invalid URL").max(200).nullable(),
        shop_category: Yup.number().integer("Invalid category").nullable(),
        status: Yup.string().oneOf(["Online", "Busy", "Offline"]).required(),
        working_start_time: Yup.string().required("Start time is required"),
        working_end_time: Yup.string().required("End time is required"),
        shop_location: Yup.object({
          address: Yup.string().required("Address is required"),
          latitude: Yup.number().required("Latitude is required"),
          longitude: Yup.number().required("Longitude is required"),
        }),
      }),
    }),
    onSubmit: async (values) => {
      console.log("data to be sent", values);
      setIsLoading(true);
      try {
        const response = await axios.post(`${baseUrl}api/business-owner/sign-up/`, values, {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
    
        if (response.status === 201) {
          toast.success("Shop created successfully!");
          setTimeout(() => {
            navigate("/shops");
          }, 1000);
        }
      } catch (err) {
        console.log(err);
        const errorData = err.response?.data;
        if (errorData && typeof errorData === "object" && Object.keys(errorData).length > 0) {
          let errorMessages = [];
          
          const extractErrors = (obj) => {
            for (const [key, value] of Object.entries(obj)) {
              if (Array.isArray(value)) {
                errorMessages = errorMessages.concat(value.filter(item => typeof item === "string"));
              } else if (typeof value === "object" && value !== null) {
                extractErrors(value); 
              }
            }
          };
    
          if (errorData.errors) {
            extractErrors(errorData.errors);
          }
    
          if (errorMessages.length > 0) {
            toast.error(errorMessages.join(" "));
          } else {
            toast.error("Unknown error occurred.");
          }
        } else {
          toast.error("Unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    } 
  });
  async function getCategories(){
    try {
      const res = await axios.get(`${baseUrl}api/shop-categories/`, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      console.log(res?.data?.data);
      return res?.data?.data;
    } catch (error) {
      console.log(error);
    }
  }
  const{data:categories,isLoading:isCategoryLoading}=useQuery({
    queryKey:["categories"],
    queryFn:getCategories
  })

  return (
    <div className="container mt-4">
      <Toaster />
      <div className="card p-4">
        <h2 className="mb-5 fw-bold " 
        style={{
          color:"var(--mainColor)"
        }}
        >Add Shop</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="fw-bold mb-2">Owner Email</label>
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
            <label className="fw-bold mb-2">Owner Name</label>
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
            <label className="fw-bold mb-2">Owner Phone Number</label>
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
            <label className="fw-bold mb-2">Shop Name</label>
            <input
              type="text"
              name="shop.shop_name"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.shop.shop_name}
            />
            {formik.touched.shop?.shop_name && formik.errors.shop?.shop_name && (
              <div className="text-danger">{formik.errors.shop.shop_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Shop Description</label>
            <input
              type="text"
              name="shop.shop_description"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.shop.shop_description}
            />
            {formik.touched.shop?.shop_description && formik.errors.shop?.shop_description && (
              <div className="text-danger">{formik.errors.shop.shop_description}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Shop Phone Number</label>
            <input
              type="text"
              name="shop.shop_phone_number"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.shop.shop_phone_number}
            />
            {formik.touched.shop?.shop_phone_number && formik.errors.shop?.shop_phone_number && (
              <div className="text-danger">{formik.errors.shop.shop_phone_number}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Facebook URL</label>
            <input
              type="text"
              name="shop.shop_facebook_url"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.shop.shop_facebook_url}
            />
            {formik.touched.shop?.shop_facebook_url && formik.errors.shop?.shop_facebook_url && (
              <div className="text-danger">{formik.errors.shop.shop_facebook_url}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Shop Category (Optional)</label>
            <select
              type="number"
              name="shop.shop_category"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.shop.shop_category || ""}
            >
              {isLoading && <option>Loading...</option>}
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Status</label>
            <select
              name="shop.status"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.shop.status}
            >
              <option value="Online">Online</option>
              <option value="Busy">Busy</option>
              <option value="Offline">Offline</option>
            </select>
            {formik.touched.shop?.status && formik.errors.shop?.status && (
              <div className="text-danger">{formik.errors.shop.status}</div>
            )}
          </div>
          <div className="mb-3 d-flex align-items-center gap-3">
            <div>
              <label className="fw-bold mb-2">Start From</label>
              <input
                type="time"
                name="shop.working_start_time"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.shop.working_start_time || ""}
              />
              {formik.touched.shop?.working_start_time && formik.errors.shop?.working_start_time && (
                <div className="text-danger">{formik.errors.shop.working_start_time}</div>
              )}
            </div>

            <div>
              <label className="fw-bold mb-2">End To</label>
              <input
                type="time"
                name="shop.working_end_time"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.shop.working_end_time || ""}
              />
            </div>
            {formik.touched.shop?.working_end_time && formik.errors.shop?.working_end_time && (
              <div className="text-danger">{formik.errors.shop.working_end_time}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Search Location</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className="btn btn-primary" type="button" onClick={onSearch}>
                Search
              </button>
            </div>
          </div>

          <div className="mb-3 position-relative">
            <LoadScript googleMapsApiKey="AIzaSyAIsV8XbX_RjYEBJYveFkDgZTBxOvL_wMQ">
              <GoogleMap
                mapContainerStyle={{ height: "300px", width: "100%" }}
                center={position}
                zoom={13}
                onClick={onMapClick}
              >
                <MarkerF position={position} />
              </GoogleMap>
            </LoadScript>
            <button
              className="btn btn-primary position-absolute"
              style={{ top: "10px", right: "10px", zIndex: 10 }}
              type="button"
              onClick={detectCurrentLocation}
            >
              Detect My Location
            </button>
          </div>

          <div className="mb-5">
            <label className="fw-bold mb-2">Shop Address</label>
            <input
              type="text"
              name="shop.shop_location.address"
              className="form-control"
              value={formik.values.shop.shop_location.address}
              readOnly
            />
          </div>

          <div className="">
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? <ColorRing height={20} width={20} /> : "Add Shop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}