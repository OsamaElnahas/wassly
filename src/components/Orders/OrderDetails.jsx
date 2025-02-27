import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardIdentifier from "../CardIdentifier/CardIdentifier";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import Errors from "../Error/Errors";
import logo from "../../images/ordder.png";
import { GoogleMap, useJsApiLoader,MarkerF } from '@react-google-maps/api';

export default function OrderDetails() {
  const { id } = useParams();

  // Map configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Ensure this is correct
  });

  const zoom = 15; // Zoom level for a closer view

  // State for map center
  const [mapCenter, setMapCenter] = useState({
    lat: 30.0444, // Default center (Cairo, Egypt)
    lng: 31.2357,
  });

  // Fetch order details
  async function getOrderDetails() {
    try {
      const res = await axios.get(`https://wassally.onrender.com/api/orders/${id}`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
      });
      return res?.data?.data;
    } catch (error) {
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: getOrderDetails,
    retry: 2,
  });

  // Update map center when data is loaded
  useEffect(() => {
    if (data?.location?.latitude && data?.location?.longitude) {
      const newLat = parseFloat(data.location.latitude);
      const newLng = parseFloat(data.location.longitude);

      if (!isNaN(newLat) && !isNaN(newLng)) {
        setMapCenter({ lat: newLat, lng: newLng });
      }
    }
  }, [data]);

  if (isLoading) return <Loader />;

  if (isError) {
    if (!error.response) return <Errors errorMessage="No Internet Connection" />;
    const status = error.response.status;
    if (status === 401 || status === 403) return <Errors errorMessage="Unauthorized Access" />;
    if (status === 404) return <Errors errorMessage="Not Found" />;
    if (status >= 500) return <Errors errorMessage="Server Error, Please Try Again;" />;
    return <Errors errorMessage={`Error: ${error.message}`} />;
  }

  // console.log("Data:", data);
  // console.log("Order Location:", data?.location);
  // console.log("Latitude:", data?.location?.latitude);
  // console.log("Longitude:", data?.location?.longitude);
  // console.log("Using Center:", mapCenter);

  return (
    <>
      <CardIdentifier
        status={data?.status}
        title={data?.order_name}
        id={data?.id}
        order_date={data?.order_date}
        order_price={data?.order_price}
        delivery_fee={data?.delivery_fee}
        total_price={data?.total_price}
        from_multiple_shops={data?.from_multiple_shops}
        coins={data?.coins}
        is_delivered={data?.is_delivered}
        is_picked={data?.is_picked}
        user={data?.user}
        delivery_crew={data?.delivery_crew}
        notes={data?.notes}
        location={data?.location?.address}
        image={logo}
      />

      <div className="row gx-0">
        {isLoaded && !loadError  && (
          <div className="mt-4 container">
            <h3>Order Location on Map</h3>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={zoom}
            >
              {data?.location?.latitude && data?.location?.longitude && (
                <MarkerF position={mapCenter} />
              )}
            </GoogleMap>
          </div>
        )}
      </div>
    </>
  );
}