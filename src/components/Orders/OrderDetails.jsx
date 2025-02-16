import React from "react";
import { useParams } from "react-router-dom";
import CardIdentifier from "../CardIdentifier/CardIdentifier";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import Errors from "../Error/Errors";

export default function OrderDetails() {
  const { id } = useParams();

  async function getOrderDetails() {
    try {
      const res = await axios.get(`https://wassally.onrender.com/api/orders/${id}`,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
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

  if (isLoading) return <Loader />;

  if (isError) {
    if (!error.response) {
      return <Errors errorMessage="No Internet Connection" />;
    }

    const status = error.response.status;

    if (status === 401 || status === 403) {
      return <Errors errorMessage="Unauthorized Access"/>;
    }

    if (status === 404) {
      return <Errors errorMessage="Not Found" />;
    }

    if (status >= 500) {
      return <Errors errorMessage="Server Error, Please Try Again;" />
    }

    return <Errors errorMessage= {`Error : ${error.message}`}/>
  }

  return (
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
    />
  );
}
