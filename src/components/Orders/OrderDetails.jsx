import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardIdentifier from "../CardIdentifier/CardIdentifier";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import Errors from "../Error/Errors";
import logo from "../../images/ordder.webp";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent, faStore, faTag } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";

export function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); // 10
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 07
  const year = date.getFullYear(); // 2025

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0"); // 18

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 to 12 for midnight
  hours = String(hours).padStart(2, "0"); // format as 2-digit

  return `${day}-${month}-${year} | ${hours}:${minutes} ${ampm}`;
}

export default function OrderDetails() {
  const { id } = useParams();
  const baseUrl = useSelector(selectBaseUrl);

  // Map configuration
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY, // Ensure this is correct
  });

  const zoom = 15; // Zoom level for a closer view

  // State for map center
  const [mapCenter, setMapCenter] = useState({
    lat: 30.0444, // Default center (Cairo, Egypt)
    lng: 31.2357,
  });
  function cleanAddress(address) {
    if (!address || typeof address !== "string") return ""; // return empty string or fallback
    address = address.split(",").slice(1).join(",").trim();
    return address.replace(/\d+\s*,?\s*Egypt/i, "Egypt").trim();
  }

  // Fetch order details
  async function getOrderDetails() {
    try {
      const res = await axios.get(`${baseUrl}api/wassally/orders/${id}`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
      });
      console.log(res?.data?.data);

      return res?.data?.data;
    } catch (error) {
      console.log(error);

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
    if (!error.response)
      return <Errors errorMessage="No Internet Connection" />;
    const status = error.response.status;
    if (status === 401 || status === 403)
      return <Errors errorMessage="Unauthorized Access" />;
    if (status === 404) return <Errors errorMessage="Not Found" />;
    if (status >= 500)
      return <Errors errorMessage="Server Error, Please Try Again;" />;
    return <Errors errorMessage={`Error: ${error.message}`} />;
  }

  // console.log("Data:", data);
  // console.log("Order Location:", data?.location);
  // console.log("Latitude:", data?.location?.latitude);
  // console.log("Longitude:", data?.location?.longitude);
  // console.log("Using Center:", mapCenter);
  console.log(" Order Items:", data?.order_items);

  return (
    <>
      <section>
        <CardIdentifier
          status={data?.status}
          title={data?.receiver_name}
          order_date={data?.order_date}
          order_price={data?.order_price}
          delivery_fee={data?.delivery_fee}
          total_price={data?.total_price}
          from_multiple_shops={data?.from_multiple_shops}
          coins={data?.coins}
          is_delivered={data?.is_delivered}
          is_picked={data?.is_picked}
          notes={data?.notes}
          location={cleanAddress(data?.location?.address)}
          image={data?.order_image_url || logo}
          TayarName={data?.delivery_crew?.username}
          OrderType={
            data?.order_type == "DeliveryRequest" ? "Delivery Request" : "Order"
          }
          ShopOrderdName={data?.request_shop?.shop_name}
          ShopOrderdId={data?.request_shop?.id}
          TayarPhone={data?.delivery_crew?.phone_number}
          ReciverPhone={data?.receiver_phone}
          OrderCode={data?.code}
          created_at={formatDate(data?.created_at)}
          price={data?.price}
          wassally_price={data?.wassally_service}
          TayarId={data?.delivery_crew?.id}
          delivered_at={formatDate(data?.delivered_at)}
          picked_at={formatDate(data?.picked_at)}
        />
      </section>
      {data?.order_type == "Order" && (
        <section>
          <div className="container">
            <div className="orderItems bg-white shadow rounded-3 p-4">
              <div className="fs-5 fw-bold text-primary border-bottom pb-2 mb-4">
                Order Items
              </div>

              {data?.order_items?.length === 0 ? (
                <div className="text-center text-primary fs-5">No Items</div>
              ) : (
                <div className="row gy-4">
                  {data?.order_items?.map((item, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                      <div
                        className="h-100 p-3 border border-primary rounded bg-light text-muted position-relative d-flex flex-column justify-content-between"
                        style={{ backgroundColor: "#e7f1ff" }}
                      >
                        <FontAwesomeIcon
                          icon={faStore}
                          size="lg"
                          className="text-primary position-absolute"
                          style={{ top: "-16px", right: "-8px", zIndex: 1000 }}
                        />

                        {/* Shop Info */}
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <img
                            src={item?.shop?.image}
                            className="rounded-circle"
                            alt=""
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <span className="fw-bold">{item?.shop?.name}</span>
                        </div>

                        {/* Items List */}
                        <div className="d-flex flex-column gap-2">
                          {item?.items?.map((item, index) => (
                            <div
                              className="bg-white p-2 shadow-sm rounded-2"
                              key={index}
                            >
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <img
                                  src={item?.product?.image_url}
                                  className="rounded-circle"
                                  alt=""
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    objectFit: "cover",
                                  }}
                                />
                                <span>
                                  {item?.quantity.toFixed(1)}{" "}
                                  {item?.product?.quantity_type === "Numerical"
                                    ? ""
                                    : "kg"}{" "}
                                  x {item?.product?.name}
                                </span>
                              </div>

                              {item?.product?.has_offer && (
                                <div className="text-danger small">
                                  {item?.product?.discount_percentage}%{" "}
                                  <FontAwesomeIcon icon={faTag} />
                                </div>
                              )}

                              <div className="small">
                                Price: {item?.product?.price} LE
                              </div>

                              {item?.product?.has_offer && (
                                <div className="small fw-bold">
                                  Offer Price:{" "}
                                  {item?.product?.price_after_offer} LE
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="fw-bold text-primary container mt-3">
                          Shop Total Price : {item?.shop_items_price} LE
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {data?.location && (
        <section>
          <div className="row gx-0">
            {isLoaded && !loadError && (
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
        </section>
      )}
    </>
  );
}
