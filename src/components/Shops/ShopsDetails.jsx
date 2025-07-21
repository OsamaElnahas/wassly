import React from "react";
import logo from "../../images/3998266.webp";
import CardIdentifier from "../CardIdentifier/CardIdentifier";
import Loader from "../Loader/Loader";
import Errors from "../Error/Errors";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux';
import { selectBaseUrl } from '../../features/api/apiSlice';

export default function ShopsDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const baseUrl = useSelector(selectBaseUrl);
  function cleanAddress(address) {
    address= address.split(',').slice(1).join(',').trim();
    return address.replace(/\d+\s*,?\s*Egypt/i, 'Egypt').trim();
  }

  // Fetch shop details
  async function getShopDetails() {
    try {
      const res = await axios.get(`${baseUrl}api/shops/${id}`, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      console.log("Shop Details:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  }

  // Update shop status
  async function updateShopStatus(newStatus) {
    try {
      const res = await axios.patch(
        `${baseUrl}api/shops/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      console.log("Status Updated:", res.data);
      
      return res.data;
    } catch (error) {
      console.error("Error updating status", error);
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["shopDetails", id],
    queryFn: getShopDetails,
  });

  const mutation = useMutation({
    mutationFn: updateShopStatus,
    onSuccess: () => {
      
      queryClient.invalidateQueries(["shopDetails", id]);
      toast.success("Shop status updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      toast.error(`Failed to update Status: ${error?.response?.data?.detail}`, {
        position: "top-center",
        autoClose: 3000,
      });
    },
  });

  const handleToggle = () => {
    const newStatus = data?.data?.status === "Online" ? "Offline" : "Online";
    mutation.mutate(newStatus);
  };

  if (isLoading) return <Loader />;

  if (isError) {
    if (!error.response) {
      return <Errors errorMessage="No Internet Connection" />;
    }
    const status = error.response.status;
    if (status === 401 || status === 403) {
      return <Errors errorMessage="Unauthorized Access" />;
    }
    if (status === 404) {
      return <Errors errorMessage="Not Found" />;
    }
    if (status >= 500) {
      return <Errors errorMessage="Server Error, Please Try Again" />;
    }
    return <Errors errorMessage={`Error: ${error.message}`} />;
  }

  return (
    <div className="d-flex flex-column">
      <ToastContainer />

      <button
        className="ml-auto mt-2 d-flex align-items-center justify-content-center hover:opacity-80 focus-ring"
        style={{
          width: "60px",
          height: "60px",
          fontSize: "12px",
          borderRadius: "50%",
          padding: "4px",
          backgroundColor: data?.data?.status === "Online" ? "gray" : "green",
          color: "white",
          border: "none",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onClick={handleToggle}
      >
        {data?.data?.status === "Online" ? " Switch Off" : "Switch On"}
      </button>
      <CardIdentifier
        title={data?.data?.shop_name}
        describtion={data?.data?.shop_description}
        status={data?.data?.status}
        image={data?.data?.shop_image_url ? data.data.shop_image_url : logo}
        imageFallback={logo}
        phone={data?.data?.shop_phone_number}
        orders={data?.data?.confirmed_orders}
location={cleanAddress(data?.data?.shop_location.address)}
        id={data?.data?.id}
      />
    </div>
  );
}