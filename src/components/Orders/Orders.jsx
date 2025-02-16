import React from 'react'
import styles from "./Orders.module.css"
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';

export default function Orders() {

    async function getOrders(){
        try {
            const res = await axios.get("https://wassally.onrender.com/api/orders/", {
                headers: {
                    Authorization: "Token " + localStorage.getItem("token")
                }
            });
            console.log(res?.data?.data);
            return res?.data?.data;
            
        } catch(error) {
            console.error("Error fetching data", error);
            throw error;
            
        }
    }

    const { data, isLoading, isError,error } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });
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
    

    if (isLoading) return <Loader/>;

    return (
        <div className="container">
            <div className={styles.ordersLength}>Orders ({data?.length})</div>
    <div className={` ${styles.orders} row mb-1 g-0`}> 
        {data?.length > 0 ? (
            data.map((order) => (
                <div className={`col-6  px-2`  } key={order.id}>  
                    <Link className={`${styles.order} d-block`} to={`/orderDetails/${order.id}`}>
                        <div className="row">
                            <div className="col-3">
                                <div className="title">Name: {order.order_name}</div>
                                <div className={styles.id}>ID: {order.id}</div>
                                <div className={styles.totalprice}>Total Price: {order.total_price} LE</div>
                            </div>
                            <div className="col-4">
                                <div className={styles.status}>Status: {order.status}</div>
                                <div className={styles.delevired}>Delivered: {order.is_delivered?.toString()}</div>
                                <div className={styles.picked}>Picked: {order.is_picked?.toString()}</div>
                            </div>
                            <div className={`col-5 ${styles.details}`}>

                                <div className={styles.location}>Location: {order.location.address}</div>
                                <div className={styles.date}>Date:<br/> {order.order_date}</div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))
        ) : (
            <p style={{
                textAlign: "center",
                padding: "12px",
                fontSize: "24px",
                fontWeight: "600",
                color: "var(--mainColor)"
            }}>No orders found.</p>
        )}
    </div>
</div>

       
    );
}
