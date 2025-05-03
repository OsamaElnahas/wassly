import React, { useState } from 'react'
// import styles from './ShopsDetails.module.css'
import logo from '../../images/3998266.webp'
import Card from '../Cards/Card'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import CardIdentifier from '../CardIdentifier/CardIdentifier';
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';

export default function ShopsDetails() {
  const { id } = useParams();

  async function getShopDetails() {
    try {
      const res = await axios.get(`https://wassally.onrender.com/api/shops/${id}`, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token")
        }
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching data", error)
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["shopDetails"],
    queryFn: getShopDetails,
  });

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
      return <Errors errorMessage="Server Error, Please Try Again;" />
    }

    return <Errors errorMessage={`Error : ${error.message}`} />
  }

  return (
    <CardIdentifier
      title={data?.data?.shop_name}
      describtion={data?.data?.shop_description}
      status={data?.data?.status}
      image={  data?.data?.shop_image_url
        ? data.data.shop_image_url
        : logo }
      imageFallback={logo} 
      phone={data?.data?.shop_phone_number}
      orders={data?.data?.confirmed_orders}
      location={data?.data?.shop_location.address}
      id={data?.data?.id}
    />
  );
}
